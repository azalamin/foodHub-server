import { RequestHandler } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { reviewService } from "./review.service";

const createReview: RequestHandler = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized access",
			});
		}

		if (req.user.role !== UserRole.CUSTOMER) {
			return res.status(403).json({
				success: false,
				message: "Only customers can leave reviews",
			});
		}

		const result = await reviewService.createReview(req.user.id, req.body);

		res.status(201).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: "Review creation failed",
			error,
		});
	}
};

export const reviewController = {
	createReview,
};
