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
				res.status(401).json({
					success: false,
					message: "You are not authorized!",
				});
			}

			if (!session?.user.emailVerified) {
				res.status(403).json({
					success: false,
					message: "Email verification required. Please verify your email!",
				});
			}

			req.user = {
				id: session?.user.id!,
				email: session?.user.email!,
				emailVerified: session?.user.emailVerified as boolean,
				name: session?.user.name!,
				role: session?.user.role!,
			};

			if (roles.length && !roles.includes(req.user.role as UserRole)) {
				res.status(403).json({
					success: false,
					message: "Forbidden! You do not have permission to access this resources!",
				});
			}

			next();
		} catch (error) {
			next(error);
		}
	};
};
