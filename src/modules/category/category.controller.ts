import { RequestHandler } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { categoryService } from "./category.service";

const createCategory: RequestHandler = async (req, res) => {
	try {
		if (!req.user || req.user.role !== UserRole.ADMIN) {
			return res.status(400).json({
				success: false,
				message: "Unauthorized access!",
			});
		}

		const result = await categoryService.createCategory(req.body);
		res.status(201).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			error: "Category creation failed",
			details: error,
		});
	}
};
const getAllCategories: RequestHandler = async (req, res) => {
	try {
		// if (!req.user || req.user.role !== UserRole.ADMIN) {
		// 	return res.status(400).json({
		// 		success: false,
		// 		message: "Unauthorized access!",
		// 	});
		// }

		const result = await categoryService.getAllCategories();
		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			error: "Category creation failed",
			details: error,
		});
	}
};

export const categoryController = {
	createCategory,
	getAllCategories,
};
