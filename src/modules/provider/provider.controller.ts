import { RequestHandler } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { providerService } from "./provider.service";

const getMyProfile: RequestHandler = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		const result = await providerService.getMyProfile(req.user.id);

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: "Failed to fetch provider profile",
			error,
		});
	}
};

const updateMyProfile: RequestHandler = async (req, res) => {
	try {
		if (!req.user || req.user.role !== UserRole.PROVIDER) {
			return res.status(403).json({
				success: false,
				message: "Only providers can update profile",
			});
		}

		const result = await providerService.updateMyProfile(req.user.id, req.body);

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: "Failed to update provider profile",
			error,
		});
	}
};

const getProviderProfileWithMeals: RequestHandler = async (req, res) => {
	try {
		const { providerId } = req.params;

		const result = await providerService.getProviderProfileWithMeals(providerId as string);

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: "Failed to fetch provider",
			error,
		});
	}
};

const getIncomingOrders: RequestHandler = async (req, res) => {
	try {
		if (!req.user || req.user.role !== UserRole.PROVIDER) {
			return res.status(403).json({
				success: false,
				message: "Only providers can view orders",
			});
		}

		const provider = await prisma.providerProfile.findFirst({
			where: { userId: req.user.id },
		});

		if (!provider) throw new Error("Provider profile not found");

		const result = await providerService.getIncomingOrders(provider.id);

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: "Failed to fetch orders",
			error,
		});
	}
};

const updateOrderStatus: RequestHandler = async (req, res) => {
	try {
		if (!req.user || req.user.role !== UserRole.PROVIDER) {
			return res.status(403).json({
				success: false,
				message: "Only providers can update order status",
			});
		}

		const { orderId } = req.params;
		const { status } = req.body;

		const provider = await prisma.providerProfile.findFirst({
			where: { userId: req.user.id },
		});

		if (!provider) throw new Error("Provider profile not found");

		const result = await providerService.updateOrderStatus(provider.id, orderId as string, status);

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Order status update failed!";
		res.status(400).json({
			success: false,
			message: errorMessage,
			error,
		});
	}
};

const updateMeal: RequestHandler = async (req, res) => {
	try {
		if (!req.user || req.user.role !== UserRole.PROVIDER) {
			return res.status(403).json({
				success: false,
				message: "Only providers can update meals",
			});
		}

		const { mealId } = req.params;

		const provider = await prisma.providerProfile.findFirst({
			where: { userId: req.user.id },
		});

		if (!provider) throw new Error("Provider profile not found");

		const result = await providerService.updateMeal(provider.id, mealId as string, req.body);

		res.status(200).json({ success: true, data: result });
	} catch (error) {
		res.status(400).json({
			success: false,
			message: "Meal update failed",
			error,
		});
	}
};

const deleteMeal: RequestHandler = async (req, res) => {
	try {
		if (!req.user || req.user.role !== UserRole.PROVIDER) {
			return res.status(403).json({
				success: false,
				message: "Only providers can delete meals",
			});
		}

		const { mealId } = req.params;

		const provider = await prisma.providerProfile.findFirst({
			where: { userId: req.user.id },
		});

		if (!provider) throw new Error("Provider profile not found");

		const result = await providerService.deleteMeal(provider.id, mealId as string);

		res.status(200).json({ success: true, data: result });
	} catch (error) {
		res.status(400).json({
			success: false,
			message: "Meal deletion failed",
			error,
		});
	}
};

export const providerController = {
	getMyProfile,
	updateMyProfile,
	getProviderProfileWithMeals,
	updateMeal,
	deleteMeal,
	getIncomingOrders,
	updateOrderStatus,
};
