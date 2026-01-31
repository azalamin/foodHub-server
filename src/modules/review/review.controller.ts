import { RequestHandler } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { AppError } from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./review.service";

const createReview: RequestHandler = catchAsync(async (req, res) => {
	if (!req.user) {
		throw new AppError(401, "Unauthorized access");
	}

	if (req.user.role !== UserRole.CUSTOMER) {
		throw new AppError(403, "Only customers can leave reviews");
	}

	const result = await reviewService.createReview(req.user.id, req.body);

	res.status(201).json({
		success: true,
		data: result,
	});
});

export const reviewController = {
	createReview,
};
