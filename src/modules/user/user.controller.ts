import { RequestHandler } from "express";
import { AppError } from "../../errors/AppError";
import { UserRole } from "../../middlewares/auth.middleware";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";

const getMyProfile: RequestHandler = catchAsync(async (req, res) => {
	if (!req.user) {
		throw new AppError(401, "Unauthorized access");
	}

	const result = await userService.getMyProfile(req.user.id);

	res.status(200).json({
		success: true,
		data: result,
	});
});

const updateMyProfile: RequestHandler = catchAsync(async (req, res) => {
	if (!req.user) {
		throw new AppError(401, "Unauthorized access");
	}

	const result = await userService.updateMyProfile(req.user.id, req.body);

	res.status(200).json({
		success: true,
		data: result,
	});
});

/* ------------ ADMIN CONTROLLERS ------------ */

const getAllUsers: RequestHandler = catchAsync(async (_req, res) => {
	const result = await userService.getAllUsers();

	res.status(200).json({
		success: true,
		data: result,
	});
});

const updateUserStatus: RequestHandler = catchAsync(async (req, res) => {
	const { userId } = req.params;
	const { status } = req.body;

	if (!status || !["ACTIVE", "SUSPENDED"].includes(status)) {
		throw new AppError(400, "Invalid status value");
	}

	const result = await userService.updateUserStatus(userId as string, status);

	res.status(200).json({
		success: true,
		data: result,
	});
});

const updateUserRoleToProvider: RequestHandler = catchAsync(async (req, res) => {
	const { userId } = req.params;
	const { role } = req.body;

	if (role === UserRole.provider) {
		const result = await userService.updateUserRoleToProvider(userId as string, role);

		res.status(200).json({
			success: true,
			message: "Provider created successfully!",
			data: result,
		});
	}
});

export const userController = {
	getMyProfile,
	updateMyProfile,
	getAllUsers,
	updateUserStatus,
	updateUserRoleToProvider,
};
