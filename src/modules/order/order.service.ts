import { OrderStatus } from "../../../generated/prisma/enums";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { CreateOrderPayload } from "../../types/order.type";

const createOrder = async (customerId: string, payload: CreateOrderPayload) => {
	if (!payload.items || payload.items.length === 0) {
		throw new AppError(400, "Order must contain at least one item");
	}

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
		throw new AppError(400, "Some meals are unavailable");
	}

	const uniqueProviderIds = new Set(meals.map(m => m.providerId));

	if (uniqueProviderIds.size > 1) {
		throw new AppError(400, "All meals must be from the same provider");
	}

	if (!uniqueProviderIds.has(payload.providerId)) {
		throw new AppError(400, "Invalid provider for selected meals");
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
			status: OrderStatus.PLACED,
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
	if (!userId) {
		throw new AppError(401, "Unauthorized access");
	}

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
	if (!orderId) {
		throw new AppError(400, "Order ID is required");
	}

	const order = await prisma.order.findFirst({
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

	if (!order) {
		throw new AppError(404, "Order not found");
	}

	return order;
};

const cancelOrder = async (customerId: string, orderId: string) => {
	if (!orderId) {
		throw new AppError(400, "Order ID is required");
	}

	const order = await prisma.order.findFirst({
		where: {
			id: orderId,
			customerId,
		},
	});

	if (!order) {
		throw new AppError(404, "Order not found");
	}

	if (order.status !== OrderStatus.PLACED) {
		throw new AppError(400, "Order cannot be cancelled at this stage");
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
