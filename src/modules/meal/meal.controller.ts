import { RequestHandler } from "express";
import { DietaryType, UserRole } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
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

const getAllMeals: RequestHandler = async (req, res) => {
	try {
		const search = typeof req.query.search === "string" ? req.query.search : undefined;

		let isAvailable: boolean | undefined = undefined;
		if (typeof req.query.isAvailable === "string") {
			if (req.query.isAvailable === "true") isAvailable = true;
			if (req.query.isAvailable === "false") isAvailable = false;
		}

		const providerId = typeof req.query.providerId === "string" ? req.query.providerId : undefined;

		const categoryId = typeof req.query.categoryId === "string" ? req.query.categoryId : undefined;

		const dietaryPreference =
			typeof req.query.dietaryType === "string" &&
			Object.values(DietaryType).includes(req.query.dietaryType as DietaryType)
				? (req.query.dietaryType as DietaryType)
				: undefined;

		const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);

		const result = await mealService.getAllMeals({
			search,
			categoryId,
			providerId,
			dietaryPreference,
			isAvailable,
			page,
			limit,
			skip,
			sortBy,
			sortOrder,
		});

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: "Meal fetch failed",
			error,
		});
	}
};

export const mealController = {
	createMeal,
	getSingleMeal,
	getAllMeals,
};
