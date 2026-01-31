import { Router } from "express";
import { authMiddleware, UserRole } from "../../middlewares/auth.middleware";
import { categoryController } from "./category.controller";

const router = Router();

router.post("/categories", authMiddleware(UserRole.admin), categoryController.createCategory);
router.get("/categories", categoryController.getAllCategories);

router.patch(
	"/categories/:categoryId",
	authMiddleware(UserRole.admin),
	categoryController.updateCategory,
);

router.delete(
	"/categories/:categoryId",
	authMiddleware(UserRole.admin),
	categoryController.deleteCategory,
);

export const categoryRoute = router;
