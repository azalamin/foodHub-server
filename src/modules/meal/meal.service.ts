import { Meal } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

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

export const mealService = {
	createMeal,
};
