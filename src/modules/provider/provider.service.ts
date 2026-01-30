import { Meal, OrderStatus, ProviderProfile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// ------------------- PROFILE ------------------------
const getMyProfile = async (userId: string) => {
	const profile = await prisma.providerProfile.findFirst({
		where: {
			userId,
			user: {
				status: "ACTIVE",
			},
		},
	});

	return profile;
};

const updateMyProfile = async (userId: string, data: Partial<ProviderProfile>) => {
	const profile = await prisma.providerProfile.findFirst({
		where: { userId },
	});

	if (!profile) {
		throw new Error("Provider profile not found");
	}

	const updated = await prisma.providerProfile.update({
		where: {
			id: profile.id,
		},
		data,
	});

	return updated;
};

const getProviderProfileWithMeals = async (providerId: string) => {
	const provider = await prisma.providerProfile.findFirst({
		where: {
			id: providerId,
			isOpen: true,
			user: {
				status: "ACTIVE",
			},
		},
		include: {
			meals: {
				where: {
					isAvailable: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});

	return provider;
};

const getIncomingOrders = async (providerId: string) => {
	return prisma.order.findMany({
		where: {
			providerId,
			status: OrderStatus.PLACED,
		},
		include: {
			items: {
				include: { meal: true },
			},
			customer: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
};

// ---------- MENU ----------

const updateMeal = async (providerId: string, mealId: string, data: Partial<Meal>) => {
	const meal = await prisma.meal.findFirst({
		where: {
			id: mealId,
			providerId,
		},
	});

	if (!meal) {
		throw new Error("Meal not found or unauthorized");
	}

	return prisma.meal.update({
		where: { id: mealId },
		data,
	});
};

const deleteMeal = async (providerId: string, mealId: string) => {
	const meal = await prisma.meal.findFirst({
		where: {
			id: mealId,
			providerId,
		},
	});

	if (!meal) {
		throw new Error("Meal not found or unauthorized");
	}

	return prisma.meal.delete({
		where: { id: mealId },
	});
};

// ---------- UPDATE ORDER STATUS ----------
const updateOrderStatus = async (providerId: string, orderId: string, newStatus: OrderStatus) => {
	const order = await prisma.order.findFirst({
		where: {
			id: orderId,
			providerId,
		},
	});

	if (!order) {
		throw new Error("Order not found or unauthorized");
	}

	if (order.status === newStatus) {
		throw new Error("Already order status updated!");
	}

	const validTransitions: Record<OrderStatus, OrderStatus[]> = {
		PLACED: [OrderStatus.PREPARING],
		PREPARING: [OrderStatus.READY],
		READY: [OrderStatus.DELIVERED],
		DELIVERED: [],
		CANCELLED: [],
	};

	if (!validTransitions[order.status].includes(newStatus)) {
		throw new Error("Invalid order status transition");
	}

	return prisma.order.update({
		where: { id: orderId },
		data: { status: newStatus },
	});
};

export const providerService = {
	getMyProfile,
	updateMyProfile,
	getProviderProfileWithMeals,
	updateMeal,
	deleteMeal,
	getIncomingOrders,
	updateOrderStatus,
};
