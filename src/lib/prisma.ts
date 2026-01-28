import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient, UserRole } from "../../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

const basePrisma = new PrismaClient({ adapter });

export const prisma = basePrisma.$extends({
	query: {
		user: {
			create: async ({ args, query }) => {
				const user = await query(args);
				// console.log({ user, args, query });
				// Auto-create ProviderProfile
				if (user.role === UserRole.PROVIDER) {
					const existingProfile = await basePrisma.providerProfile.findUnique({
						where: { userId: user.id as string },
					});

					if (!existingProfile) {
						await basePrisma.providerProfile.create({
							data: {
								userId: user.id,
								restaurantName: "My Restaurant",
								address: "",
								phone: "",
								isOpen: true,
							},
						});
					}
				}

				return user;
			},
		},
	},
});
