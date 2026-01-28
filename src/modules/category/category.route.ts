import { Router } from "express";
import { authMiddleware, UserRole } from "../../middlewares/auth.middleware";
import { categoryController } from "./category.controller";

const router = Router();

router.post("/category", authMiddleware(UserRole.admin), categoryController.createCategory);

export const categoryRoute = router;
