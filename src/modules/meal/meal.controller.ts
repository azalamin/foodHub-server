import { RequestHandler } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { mealService } from "./meal.service";

const createMeal: RequestHandler = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(400).json({
				success: false,
				message: "Unauthorized access!",
			});
		}

		if (req.user.role !== UserRole.PROVIDER) {
			return res.status(403).json({
				success: false,
				message: "Only providers can create meals",
			});
		}

		const provider = await prisma.providerProfile.findFirst({
			where: { userId: req.user.id },
		});

		if (!provider) {
			return res.status(400).json({
				success: false,
				message: "Provider profile not found",
			});
		}

		const result = await mealService.createMeal(req.body, provider.id);

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

const getSingleMeal: RequestHandler = async (req, res) => {
	try {
		const { mealId } = req.params;
		const result = await mealService.getSingleMeal(mealId as string);

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			error: "Meal fetched failed",
			details: error,
		});
	}
};

export const mealController = {
	createMeal,
	getSingleMeal,
};
