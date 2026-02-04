import { toNodeHandler } from "better-auth/node";
import express, { Application } from "express";

import cors from "cors";
import "dotenv/config";
import { auth } from "./lib/auth";
import errorHandler from "./middlewares/globalErrorHandler";
import notFoundHandler from "./middlewares/notFoundHandler";
import { categoryRoute } from "./modules/category/category.route";
import { mealRoute } from "./modules/meal/meal.route";
import { orderRoute } from "./modules/order/order.route";
import { providerRoute } from "./modules/provider/provider.route";
import { reviewRoute } from "./modules/review/review.route";
import { userRoute } from "./modules/user/user.route";

const app: Application = express();

// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = [
	process.env.APP_URL || "http://localhost:4000",
	process.env.PROD_APP_URL, // Production frontend URL
	"http://localhost:3000",
	"http://localhost:4000",
	"http://localhost:5000",
].filter(Boolean);

app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests with no origin (mobile apps, Postman, etc.)
			if (!origin) return callback(null, true);

			// Check if origin is in allowedOrigins or matches Vercel preview pattern
			const isAllowed =
				allowedOrigins.includes(origin) ||
				/^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
				/^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

			if (isAllowed) {
				callback(null, true);
			} else {
				callback(new Error(`Origin ${origin} not allowed by CORS`));
			}
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
		exposedHeaders: ["Set-Cookie"],
	}),
);

app.use(express.json());

// Better Auth
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api", mealRoute);
app.use("/api", categoryRoute);
app.use("/api", providerRoute);
app.use("/api", orderRoute);
app.use("/api", reviewRoute);
app.use("/api", userRoute);

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
