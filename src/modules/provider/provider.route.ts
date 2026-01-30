import { Router } from "express";
import { authMiddleware, UserRole } from "../../middlewares/auth.middleware";
import { providerController } from "./provider.controller";

const router = Router();

router.get("/provider/me", authMiddleware(UserRole.provider), providerController.getMyProfile);

router.patch("/provider/me", authMiddleware(UserRole.provider), providerController.updateMyProfile);

router.get("/providers/:providerId", providerController.getProviderProfileWithMeals);

export const providerRoute = router;
