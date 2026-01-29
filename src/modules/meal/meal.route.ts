import { Router } from "express";
import { authMiddleware, UserRole } from "../../middlewares/auth.middleware";
import { mealController } from "./meal.controller";

const router = Router();

router.post("/meals", authMiddleware(UserRole.admin, UserRole.provider), mealController.createMeal);
router.get("/meals", mealController.getAllMeals);
router.get("/meals/:mealId", mealController.getSingleMeal);

export const mealRoute = router;
