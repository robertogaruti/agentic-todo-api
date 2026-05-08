import express from "express";
import categoryRouter from "./routes/categories";
import todoRouter from "./routes/todos";
import { authenticateRequest } from "./middleware/auth";

export const createApp = () => {
  const app = express();

  app.use(express.json({ limit: "100kb" }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/categories", authenticateRequest, categoryRouter);
  app.use("/api/todos", authenticateRequest, todoRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  return app;
};

const app = createApp();

export default app;
