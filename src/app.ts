import { toNodeHandler } from "better-auth/node";
import express, { Application } from "express";

import cors from "cors";
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

app.use(
	cors({
		origin: process.env.APP_URL || "http://locaholhost:3000",
		credentials: true,
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

app.use(notFoundHandler);

app.use(errorHandler);

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

export default app;
