import express, { Router } from "express";
import { authMiddleware, UserRole } from "../../middlewares/auth.middleware";
import { paymentController } from "./payment.controller";

const router = Router();

// Stripe webhook must receive raw body — registered BEFORE express.json() in app.ts
router.post(
	"/payments/webhook",
	express.raw({ type: "application/json" }),
	paymentController.stripeWebhook,
);

// Customer: create PaymentIntent + order in one call
router.post(
	"/payments/create-intent",
	authMiddleware(UserRole.customer),
	paymentController.createPaymentIntent,
);

export const paymentRoute = router;
