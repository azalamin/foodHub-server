import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CreateReviewPayload } from "../../types/review.type";

const createReview = async (customerId: string, payload: CreateReviewPayload) => {
	// Validate order
	const order = await prisma.order.findFirst({
		where: {
			id: payload.orderId,
			customerId,
		},
		include: {
			items: true,
		},
	});

	if (!order) {
		throw new Error("Order not found");
	}

	// Order must be delivered
	if (order.status !== OrderStatus.DELIVERED) {
		throw new Error("You can only review delivered orders");
	}

	// Meal must belong to this order
	const mealInOrder = order.items.find(item => item.mealId === payload.mealId);

	if (!mealInOrder) {
		throw new Error("Meal not found in this order");
	}

	// Prevent duplicate review (extra safety)
	const existingReview = await prisma.review.findUnique({
		where: {
			orderId: payload.orderId,
		},
	});

	if (existingReview) {
		throw new Error("Review already submitted for this order");
	}

	// Create review
	const review = await prisma.review.create({
		data: {
			rating: payload.rating,
			comment: payload.comment ?? null,
			orderId: payload.orderId,
			mealId: payload.mealId,
			customerId,
		},
	});

	return review;
};

export const reviewService = {
	createReview,
};
