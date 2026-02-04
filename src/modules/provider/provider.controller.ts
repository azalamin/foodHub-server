import { RequestHandler } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { catchAsync } from "../../utils/catchAsync";
import { providerService } from "./provider.service";

const createProvider: RequestHandler = catchAsync(async (req, res) => {
	const result = await providerService.createProvider(req.body);

	res.status(200).json({
		success: true,
		data: result,
	});
});

const getAllProviders: RequestHandler = catchAsync(async (req, res) => {
	const result = await providerService.getAllProviders();

	res.status(200).json({
		success: true,
		data: result,
	});
});

const getMyProfile: RequestHandler = catchAsync(async (req, res) => {
	if (!req.user) {
		throw new AppError(401, "Unauthorized");
	}

	const result = await providerService.getMyProfile(req.user.id);

	res.status(200).json({
		success: true,
		data: result,
	});
});

const updateMyProfile: RequestHandler = catchAsync(async (req, res) => {
	if (!req.user) {
		throw new AppError(401, "Unauthorized");
	}

	if (req.user.role !== UserRole.PROVIDER) {
		throw new AppError(403, "Only providers can update profile");
	}

	const result = await providerService.updateMyProfile(req.user.id, req.body);

	res.status(200).json({
		success: true,
		data: result,
	});
});

const getProviderProfileWithMeals: RequestHandler = catchAsync(async (req, res) => {
	const { providerId } = req.params;

	if (!providerId) {
		throw new AppError(400, "Provider ID is required");
	}

	const result = await providerService.getProviderProfileWithMeals(providerId as string);

	res.status(200).json({
		success: true,
		data: result,
	});
});

const getIncomingOrders: RequestHandler = catchAsync(async (req, res) => {
	if (!req.user) {
		throw new AppError(401, "Unauthorized");
	}

	if (req.user.role !== UserRole.PROVIDER) {
		throw new AppError(403, "Only providers can view orders");
	}

	const provider = await prisma.providerProfile.findFirst({
		where: { userId: req.user.id },
	});

	if (!provider) {
		throw new AppError(404, "Provider profile not found");
	}

	const result = await providerService.getIncomingOrders(provider.id);

	res.status(200).json({
		success: true,
		data: result,
	});
});

const getProviderAllOrders: RequestHandler = catchAsync(async (req, res) => {
	if (!req.user) {
		throw new AppError(401, "Unauthorized");
	}

	if (req.user.role !== UserRole.PROVIDER) {
		throw new AppError(403, "Only providers can view orders");
	}

	const provider = await prisma.providerProfile.findFirst({
		where: { userId: req.user.id },
	});

	if (!provider) {
		throw new AppError(404, "Provider profile not found");
	}

	const result = await providerService.getProviderAllOrders(provider.id);

	res.status(200).json({
		success: true,
		data: result,
	});
});

const updateOrderStatus: RequestHandler = catchAsync(async (req, res) => {
	if (!req.user) {
		throw new AppError(401, "Unauthorized");
	}

	if (req.user.role !== UserRole.PROVIDER) {
		throw new AppError(403, "Only providers can update order status");
	}

	const { orderId } = req.params;
	const { status } = req.body;

	if (!orderId || !status) {
		throw new AppError(400, "Order ID and status are required");
	}

	const provider = await prisma.providerProfile.findFirst({
		where: { userId: req.user.id },
	});

	if (!provider) {
		throw new AppError(404, "Provider profile not found");
	}

	const result = await providerService.updateOrderStatus(provider.id, orderId as string, status);

	res.status(200).json({
		success: true,
		data: result,
	});
});

const updateMeal: RequestHandler = catchAsync(async (req, res) => {
	if (!req.user) {
		throw new AppError(401, "Unauthorized");
	}

	if (req.user.role !== UserRole.PROVIDER) {
		throw new AppError(403, "Only providers can update meals");
	}

	const { mealId } = req.params;

	if (!mealId) {
		throw new AppError(400, "Meal ID is required");
	}

	const provider = await prisma.providerProfile.findFirst({
		where: { userId: req.user.id },
	});

	if (!provider) {
		throw new AppError(404, "Provider profile not found");
	}

	const result = await providerService.updateMeal(provider.id, mealId as string, req.body);

	res.status(200).json({
		success: true,
		data: result,
	});
});

const deleteMeal: RequestHandler = catchAsync(async (req, res) => {
	if (!req.user) {
		throw new AppError(401, "Unauthorized");
	}

	if (req.user.role !== UserRole.PROVIDER) {
		throw new AppError(403, "Only providers can delete meals");
	}

	const { mealId } = req.params;

	if (!mealId) {
		throw new AppError(400, "Meal ID is required");
	}

	const provider = await prisma.providerProfile.findFirst({
		where: { userId: req.user.id },
	});

	if (!provider) {
		throw new AppError(404, "Provider profile not found");
	}

	const result = await providerService.deleteMeal(provider.id, mealId as string);

	res.status(200).json({
		success: true,
		data: result,
	});
});

export const providerController = {
	createProvider,
	getAllProviders,
	getMyProfile,
	updateMyProfile,
	getProviderProfileWithMeals,
	updateMeal,
	deleteMeal,
	getIncomingOrders,
	updateOrderStatus,
	getProviderAllOrders,
};
