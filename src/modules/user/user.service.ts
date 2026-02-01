import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

/* -------- CUSTOMER / PROVIDER -------- */

const getMyProfile = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
			phone: true,
			role: true,
			status: true,
			createdAt: true,
		},
	});

	if (!user) {
		throw new AppError(404, "User not found");
	}

	return user;
};

const updateMyProfile = async (userId: string, data: any) => {
	const allowedFields = ["name", "image", "phone"];

	const updateData: any = {};
	for (const key of allowedFields) {
		if (data[key] !== undefined) {
			updateData[key] = data[key];
		}
	}

	return prisma.user.update({
		where: { id: userId },
		data: updateData,
	});
};

/* --------------- ADMIN ---------------- */

const getAllUsers = async () => {
	return prisma.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			status: true,
			createdAt: true,
		},
		where: {
			role: {
				in: ["CUSTOMER", "PROVIDER"],
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	if (!user) {
		throw new AppError(404, "User not found");
	}

	if (user.role === "ADMIN") {
		throw new AppError(403, "Admin status cannot be changed");
	}

	return prisma.user.update({
		where: { id: userId },
		data: { status },
	});
};

const updateUserRoleToProvider = async (userId: string, role: UserRole) => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	if (!user) {
		throw new AppError(404, "User not found");
	}

	if (role === UserRole.PROVIDER) {
		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				role: UserRole.PROVIDER,
			},
		});

		return updatedUser;
	}
};

export const userService = {
	getMyProfile,
	updateMyProfile,
	getAllUsers,
	updateUserStatus,
	updateUserRoleToProvider,
};
