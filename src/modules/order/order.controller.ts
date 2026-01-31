import { RequestHandler } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { AppError } from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { orderService } from "./order.service";

const createOrder: RequestHandler = catchAsync(async (req, res) => {
	if (!req.user) {
		throw new AppError(401, "Unauthorized access");
	}

	if (req.user.role !== UserRole.CUSTOMER) {
		throw new AppError(403, "Only customers can place orders");
	}

	const result = await orderService.createOrder(req.user.id, req.body);

	res.status(201).json({
		success: true,
		data: result,
	});
});

const getMyOrders: RequestHandler = catchAsync(async (req, res) => {
	if (!req.user) {
		throw new AppError(401, "Unauthorized access");
	}

	const result = await orderService.getMyOrders(req.user.id);

	res.status(200).json({
		success: true,
		data: result,
	});
});

const getSingleOrder: RequestHandler = catchAsync(async (req, res) => {
	if (!req.user) {
		throw new AppError(401, "Unauthorized access");
	}

	const { orderId } = req.params;

	if (!orderId) {
		throw new AppError(400, "Order ID is required");
	}

	const result = await orderService.getSingleOrder(req.user.id, orderId as string);

	res.status(200).json({
		success: true,
		data: result,
	});
});

const cancelOrder: RequestHandler = catchAsync(async (req, res) => {
	if (!req.user) {
		throw new AppError(401, "Unauthorized access");
	}

	if (req.user.role !== UserRole.CUSTOMER) {
		throw new AppError(403, "Only customers can cancel orders");
	}

	const { orderId } = req.params;

	if (!orderId) {
		throw new AppError(400, "Order ID is required");
	}

	const result = await orderService.cancelOrder(req.user.id, orderId as string);

	res.status(200).json({
		success: true,
		data: result,
	});
});

// Admin
const getAllOrdersForAdmin: RequestHandler = async (req, res, next) => {
	try {
		const result = await orderService.getAllOrdersForAdmin();

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

export const orderController = {
	createOrder,
	getMyOrders,
	getSingleOrder,
	cancelOrder,
	getAllOrdersForAdmin,
};
