import { Router } from "express";
import { authMiddleware, UserRole } from "../../middlewares/auth.middleware";
import { providerController } from "./provider.controller";

const router = Router();

router.post("/providers", providerController.createProvider);

router.get("/providers", providerController.getAllProviders);

router.get("/provider/me", authMiddleware(UserRole.provider), providerController.getMyProfile);

router.get("/providers/:providerId", providerController.getProviderProfileWithMeals);

router.get(
	"/provider/orders",
	authMiddleware(UserRole.provider),
	providerController.getIncomingOrders,
);

router.patch(
	"/provider/meals/:mealId",
	authMiddleware(UserRole.provider),
	providerController.updateMeal,
);

router.patch("/provider/me", authMiddleware(UserRole.provider), providerController.updateMyProfile);

router.patch(
	"/provider/orders/:orderId/status",
	authMiddleware(UserRole.provider),
	providerController.updateOrderStatus,
);

router.delete(
	"/provider/meals/:mealId",
	authMiddleware(UserRole.provider),
	providerController.deleteMeal,
);
export const providerRoute = router;
