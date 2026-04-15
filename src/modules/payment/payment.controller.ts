import { RequestHandler } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { AppError } from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";

const createPaymentIntent: RequestHandler = catchAsync(async (req, res) => {
	if (!req.user) throw new AppError(401, "Unauthorized access");
	if (req.user.role !== UserRole.CUSTOMER) throw new AppError(403, "Only customers can place orders");

	const result = await paymentService.createPaymentIntent(req.user.id, req.body);

	res.status(201).json({ success: true, data: result });
});

const stripeWebhook: RequestHandler = catchAsync(async (req, res) => {
	const signature = req.headers["stripe-signature"] as string;

	if (!signature) throw new AppError(400, "Missing stripe-signature header");

	await paymentService.handleWebhook(req.body as Buffer, signature);

	res.status(200).json({ received: true });
});

export const paymentController = {
	createPaymentIntent,
	stripeWebhook,
};
