import { Category } from "../../../generated/prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

const createCategory = async (data: Omit<Category, "id" | "createdAt" | "updatedAt" | "meals">) => {
	if (!data.name || !data.slug) {
		throw new AppError(400, "Category name and slug are required");
	}

	const existingCategory = await prisma.category.findFirst({
		where: {
			OR: [{ name: data.name }, { slug: data.slug }],
		},
	});

	if (existingCategory) {
		throw new AppError(409, "Category already exists");
	}

	const result = await prisma.category.create({
		data,
	});

	return result;
};

const getAllCategories = async () => {
	const result = await prisma.category.findMany({
		orderBy: {
			createdAt: "desc",
		},
	});

	return result;
};

export const categoryService = {
	createCategory,
	getAllCategories,
};
