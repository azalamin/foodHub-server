import { Router } from "express";
import { authMiddleware, UserRole } from "../../middlewares/auth.middleware";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/reviews", authMiddleware(UserRole.customer), reviewController.createReview);

export const reviewRoute = router;
