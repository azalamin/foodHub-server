import { toNodeHandler } from "better-auth/node";
import express, { Application } from "express";

import cors from "cors";
import { auth } from "./lib/auth";

const app: Application = express();

app.use(cors());

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

export default app;
