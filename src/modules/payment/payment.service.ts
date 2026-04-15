import Stripe from "stripe";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../../../generated/prisma/enums";
import { orderConfirmationEmail } from "../../emails/orderConfirmation";
import { AppError } from "../../errors/AppError";
import { transporter } from "../../lib/mailer";
import { prisma } from "../../lib/prisma";
import { CreateOrderPayload } from "../../types/order.type";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2026-03-25.dahlia",
});

const createPaymentIntent = async (userId: string, payload: CreateOrderPayload) => {
	if (!payload.items || payload.items.length === 0) {
		throw new AppError(400, "Order must contain at least one item");
	}

	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) throw new AppError(401, "User not found");

	const meals = await prisma.meal.findMany({
		where: {
			id: { in: payload.items.map(i => i.mealId) },
			isAvailable: true,
			provider: { isOpen: true, user: { status: "ACTIVE" } },
		},
		include: { provider: true },
	});

	if (meals.length !== payload.items.length) {
		throw new AppError(400, "One or more meals are unavailable");
	}

	const uniqueProviders = new Set(meals.map(m => m.providerId));
	if (uniqueProviders.size > 1) {
		throw new AppError(400, "Meals must be from a single provider");
	}

	const providerId = meals[0]!.providerId;

	const orderItemsData = payload.items.map(item => {
		const meal = meals.find(m => m.id === item.mealId)!;
		return {
			mealId: meal.id,
			mealName: meal.name,
			mealPrice: meal.price,
			quantity: item.quantity,
		};
	});

	const totalPrice = orderItemsData.reduce((sum, item) => sum + item.mealPrice * item.quantity, 0);

	// Create the order first with PENDING payment status
	const order = await prisma.order.create({
		data: {
			customerId: user.id,
			providerId,
			deliveryAddress: payload.deliveryAddress,
			status: OrderStatus.PLACED,
			totalPrice,
			paymentStatus: PaymentStatus.PENDING,
			paymentMethod: PaymentMethod.CARD,
			items: { create: orderItemsData },
		},
		include: { items: true },
	});

	// Create a Stripe PaymentIntent (amount in smallest unit, BDT uses paisa: multiply by 100)
	const paymentIntent = await stripe.paymentIntents.create({
		amount: Math.round(totalPrice * 100),
		currency: "bdt",
		metadata: {
			orderId: order.id,
			userId: user.id,
		},
		description: `FoodHub order #${order.id}`,
	});

	// Save the PaymentIntent ID to the order
	await prisma.order.update({
		where: { id: order.id },
		data: { stripePaymentIntentId: paymentIntent.id },
	});

	return {
		clientSecret: paymentIntent.client_secret!,
		orderId: order.id,
		totalPrice,
	};
};

const handleWebhook = async (payload: Buffer, signature: string) => {
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
	if (!webhookSecret) throw new AppError(500, "Webhook secret not configured");

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
	} catch {
		throw new AppError(400, "Invalid webhook signature");
	}

	if (event.type === "payment_intent.succeeded") {
		const paymentIntent = event.data.object as Stripe.PaymentIntent;
		const orderId = paymentIntent.metadata?.orderId;

		if (!orderId) return;

		const order = await prisma.order.update({
			where: { id: orderId },
			data: { paymentStatus: PaymentStatus.PAID },
			include: { customer: true },
		});

		// Send confirmation email after payment confirmed
		if (order.customer?.email) {
			await transporter.sendMail(
				orderConfirmationEmail({
					email: order.customer.email,
					orderId: order.id,
					totalPrice: order.totalPrice,
					address: order.deliveryAddress,
				}),
			);
		}
	}

	if (event.type === "payment_intent.payment_failed") {
		const paymentIntent = event.data.object as Stripe.PaymentIntent;
		const orderId = paymentIntent.metadata?.orderId;

		if (!orderId) return;

		await prisma.order.update({
			where: { id: orderId },
			data: {
				paymentStatus: PaymentStatus.FAILED,
				status: OrderStatus.CANCELLED,
			},
		});
	}
};

export const paymentService = {
	createPaymentIntent,
	handleWebhook,
};
