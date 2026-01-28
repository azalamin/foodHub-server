import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (data: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
	const result = await prisma.category.create({
		data: {
			...data,
		},
	});
};

export const categoryService = {
	createCategory,
};
