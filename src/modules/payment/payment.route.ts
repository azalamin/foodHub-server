import express, { Router } from "express";
import { authMiddleware, UserRole } from "../../middlewares/auth.middleware";
import { paymentController } from "./payment.controller";

// Webhook router — must be registered BEFORE express.json() (needs raw body)
const webhookRouter = Router();
webhookRouter.post(
	"/payments/webhook",
	express.raw({ type: "application/json" }),
	paymentController.stripeWebhook,
);

// API router — must be registered AFTER express.json() (needs parsed JSON body)
const apiRouter = Router();
apiRouter.post(
	"/payments/create-intent",
	authMiddleware(UserRole.customer),
	paymentController.createPaymentIntent,
);

export const paymentWebhookRoute = webhookRouter;
export const paymentApiRoute = apiRouter;
