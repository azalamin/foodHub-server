import { RequestHandler } from "express";
import { mealService } from "./meal.service";

const createMeal: RequestHandler = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(400).json({
				success: false,
				message: "Unauthorized access!",
			});
		}
		const result = await mealService.createMeal(req.body, req.user.id as string);
		res.status(201).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			error: "Meal creation failed",
			details: error,
		});
	}
};

export const mealController = {
	createMeal,
};
