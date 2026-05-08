import express from "express";
import todoRouter from "./routes/todos";

const app = express();
const PORT = process.env["PORT"] ?? 3000;

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Todo routes
app.use("/api/todos", todoRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Todo API running at http://localhost:${PORT}`);
  console.log("");
  console.log("Endpoints:");
  console.log(
    `  GET    http://localhost:${PORT}/api/todos          — list todos (filter: ?completed=true|false)`,
  );
  console.log(
    `  POST   http://localhost:${PORT}/api/todos          — create a todo`,
  );
  console.log(
    `  PATCH  http://localhost:${PORT}/api/todos/:id      — update a todo`,
  );
  console.log("");
});

export default app;
