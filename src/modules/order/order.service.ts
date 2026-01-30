import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CreateOrderPayload } from "../../types/order.type";

const createOrder = async (customerId: string, payload: CreateOrderPayload) => {
	const meals = await prisma.meal.findMany({
		where: {
			id: { in: payload.items.map(i => i.mealId) },
			isAvailable: true,
			provider: {
				isOpen: true,
				user: { status: "ACTIVE" },
			},
		},
	});

	if (meals.length !== payload.items.length) {
		throw new Error("Some meals are unavailable");
	}

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

	const order = await prisma.order.create({
		data: {
			customerId,
			providerId: payload.providerId,
			deliveryAddress: payload.deliveryAddress,
			status: "PLACED",
			totalPrice,
			items: {
				create: orderItemsData,
			},
		},
		include: {
			items: true,
		},
	});

	return order;
};

const getMyOrders = async (userId: string) => {
	return prisma.order.findMany({
		where: {
			customerId: userId,
		},
		include: {
			items: {
				include: {
					meal: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
};

const getSingleOrder = async (userId: string, orderId: string) => {
	return prisma.order.findFirst({
		where: {
			id: orderId,
			customerId: userId,
		},
		include: {
			items: {
				include: {
					meal: true,
				},
			},
			provider: true,
		},
	});
};

const cancelOrder = async (customerId: string, orderId: string) => {
	const order = await prisma.order.findFirst({
		where: {
			id: orderId,
			customerId,
		},
	});

	if (!order) {
		throw new Error("Order not found");
	}

	if (order.status !== OrderStatus.PLACED) {
		throw new Error("Order cannot be cancelled at this stage");
	}

	const cancelledOrder = await prisma.order.update({
		where: {
			id: orderId,
		},
		data: {
			status: OrderStatus.CANCELLED,
		},
	});

	return cancelledOrder;
};

export const orderService = {
	createOrder,
	getMyOrders,
	getSingleOrder,
	cancelOrder,
};
