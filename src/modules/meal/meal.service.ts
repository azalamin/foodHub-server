import { Meal } from "../../../generated/prisma/client";
import { MealWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { GetMealsParams } from "../../types/meal.type";

const createMeal = async (
	data: Omit<Meal, "id" | "createdAt" | "updatedAt" | "providerId">,
	providerId: string,
) => {
	console.log(providerId);
	const result = await prisma.meal.create({
		data: {
			...data,
			providerId,
		},
	});
	return result;
};

const getAllMeals = async ({
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
}: GetMealsParams) => {
	const where: MealWhereInput = {};

	if (search) {
		where.OR = [
			{
				name: {
					contains: search,
					mode: "insensitive",
				},
			},
			{
				description: {
					contains: search,
					mode: "insensitive",
				},
			},
		];
	}

	if (categoryId) {
		where.categoryId = categoryId;
	}

	if (providerId) {
		where.providerId = providerId;
	}

	if (dietaryPreference) {
		where.dietaryType = dietaryPreference;
	}

	if (typeof isAvailable === "boolean") {
		where.isAvailable = isAvailable;
	}

	where.provider = {
		user: {
			status: "ACTIVE",
		},
	};

	const meals = await prisma.meal.findMany({
		where,
		take: limit,
		skip,
		orderBy: {
			[sortBy]: sortOrder,
		},
	});

	const total = await prisma.meal.count({ where });

	return {
		data: meals,
		pagination: {
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		},
	};
};

const getSingleMeal = async (id: string) => {
	const result = await prisma.meal.findFirst({
		where: {
			id,
		},
	});

	return result;
};

export const mealService = {
	createMeal,
	getSingleMeal,
	getAllMeals,
};
