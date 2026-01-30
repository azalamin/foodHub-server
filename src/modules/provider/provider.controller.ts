import { RequestHandler } from "express";
import { UserRole } from "../../../generated/prisma/enums";
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

export const providerController = {
	getMyProfile,
	updateMyProfile,
	getProviderProfileWithMeals,
};
