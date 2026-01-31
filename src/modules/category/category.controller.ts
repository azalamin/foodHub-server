import { RequestHandler } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { AppError } from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./category.service";

const createCategory: RequestHandler = catchAsync(async (req, res) => {
	if (!req.user) {
		throw new AppError(401, "Unauthorized access");
	}

	if (req.user.role !== UserRole.ADMIN) {
		throw new AppError(403, "Only admin can create categories");
	}

	const result = await categoryService.createCategory(req.body);

	res.status(201).json({
		success: true,
		data: result,
	});
});

const getAllCategories: RequestHandler = catchAsync(async (req, res) => {
	const result = await categoryService.getAllCategories();

	res.status(200).json({
		success: true,
		data: result,
	});
});

const updateCategory: RequestHandler = catchAsync(async (req, res) => {
	const { categoryId } = req.params;

	const result = await categoryService.updateCategory(categoryId as string, req.body);

	res.status(200).json({
		success: true,
		data: result,
	});
});

const deleteCategory: RequestHandler = catchAsync(async (req, res) => {
	const { categoryId } = req.params;

	const result = await categoryService.deleteCategory(categoryId as string);

	res.status(200).json({
		success: true,
		data: result,
	});
});

export const categoryController = {
	createCategory,
	getAllCategories,
	updateCategory,
	deleteCategory,
};
