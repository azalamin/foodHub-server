import { Router } from "express";
import { authMiddleware, UserRole } from "../../middlewares/auth.middleware";
import { userController } from "./user.controller";

const router = Router();

/* ---------- CUSTOMER / PROVIDER ---------- */
router.get("/users/me", authMiddleware(), userController.getMyProfile);
router.patch("/users/me", authMiddleware(), userController.updateMyProfile);

/* --------------- ADMIN ------------------- */
router.get("/users/admin/users", authMiddleware(UserRole.admin), userController.getAllUsers);

router.patch(
	"/users/admin/users/:userId/status",
	authMiddleware(UserRole.admin),
	userController.updateUserStatus,
);

export const userRoute = router;
