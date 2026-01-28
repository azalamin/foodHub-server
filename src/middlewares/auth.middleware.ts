import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";

export enum UserRole {
	customer = "CUSTOMER",
	provider = "PROVIDER",
	admin = "ADMIN",
}

export const authMiddleware = (...roles: UserRole[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const session = await auth.api.getSession({
				headers: req.headers as any,
			});

			if (!session) {
				return res.status(401).json({
					success: false,
					message: "You are not authorized!",
				});
			}

			if (!session?.user.emailVerified) {
				return res.status(403).json({
					success: false,
					message: "Email verification required. Please verify your email!",
				});
			}

			const userRole = session.user.role as UserRole;

			req.user = {
				id: session?.user.id!,
				email: session?.user.email!,
				emailVerified: session?.user.emailVerified as boolean,
				name: session?.user.name!,
				role: userRole,
			};

			if (roles.length && !roles.includes(userRole)) {
				return res.status(403).json({
					success: false,
					message: "Forbidden! You do not have permission to access this resource!",
				});
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};
