import { RequestHandler } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { orderService } from "./order.service";

const createOrder: RequestHandler = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized access",
			});
		}

		if (req.user.role !== UserRole.CUSTOMER) {
			return res.status(403).json({
				success: false,
				message: "Only customers can place orders",
			});
		}

		const result = await orderService.createOrder(req.user.id, req.body);

		res.status(201).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: "Order creation failed",
			error,
		});
	}
};

const getMyOrders: RequestHandler = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized access",
			});
		}

		const result = await orderService.getMyOrders(req.user.id);

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

const getSingleOrder: RequestHandler = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized access",
			});
		}

		const { orderId } = req.params;

		const result = await orderService.getSingleOrder(req.user.id, orderId as string);

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: "Failed to fetch order",
			error,
		});
	}
};

const cancelOrder: RequestHandler = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized access",
			});
		}

		if (req.user.role !== UserRole.CUSTOMER) {
			return res.status(403).json({
				success: false,
				message: "Only customers can cancel orders",
			});
		}

		const { orderId } = req.params;

		const result = await orderService.cancelOrder(req.user.id, orderId as string);

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: "Order cancellation failed",
			error,
		});
	}
};

export const orderController = {
	createOrder,
	getMyOrders,
	getSingleOrder,
	cancelOrder,
};
