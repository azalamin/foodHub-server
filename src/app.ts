import { toNodeHandler } from "better-auth/node";
import express, { Application } from "express";

import cors from "cors";
import { auth } from "./lib/auth";
import { categoryRoute } from "./modules/category/category.route";
import { mealRoute } from "./modules/meal/meal.route";
import { orderRoute } from "./modules/order/order.route";
import { providerRoute } from "./modules/provider/provider.route";
import { reviewRoute } from "./modules/review/review.route";

const app: Application = express();

app.use(
	cors({
		origin: process.env.APP_URL || "http://locaholhost:3000",
		credentials: true,
	}),
);

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api", mealRoute);
app.use("/api", categoryRoute);
app.use("/api", providerRoute);
app.use("/api", orderRoute);
app.use("/api", reviewRoute);

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

export default app;
