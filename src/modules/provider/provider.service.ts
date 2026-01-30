import { ProviderProfile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getMyProfile = async (userId: string) => {
	const profile = await prisma.providerProfile.findFirst({
		where: {
			userId,
			user: {
				status: "ACTIVE",
			},
		},
	});

	return profile;
};

const updateMyProfile = async (userId: string, data: Partial<ProviderProfile>) => {
	const profile = await prisma.providerProfile.findFirst({
		where: { userId },
	});

	if (!profile) {
		throw new Error("Provider profile not found");
	}

	const updated = await prisma.providerProfile.update({
		where: {
			id: profile.id,
		},
		data,
	});

	return updated;
};

const getProviderProfileWithMeals = async (providerId: string) => {
	const provider = await prisma.providerProfile.findFirst({
		where: {
			id: providerId,
			isOpen: true,
			user: {
				status: "ACTIVE",
			},
		},
		include: {
			meals: {
				where: {
					isAvailable: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});

	return provider;
};

export const providerService = {
	getMyProfile,
	updateMyProfile,
	getProviderProfileWithMeals,
};
