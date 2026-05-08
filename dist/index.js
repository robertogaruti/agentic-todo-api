"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todos_1 = __importDefault(require("./routes/todos"));
const app = (0, express_1.default)();
const PORT = process.env["PORT"] ?? 3000;
app.use(express_1.default.json());
// Health check
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// Todos CRUD routes
app.use("/api/todos", todos_1.default);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
});
app.listen(PORT, () => {
    console.log(`🚀 Todo API running at http://localhost:${PORT}`);
    console.log("");
    console.log("Endpoints:");
    console.log(`  GET    http://localhost:${PORT}/api/todos          — list todos (filter: ?completed=true|false)`);
    console.log(`  POST   http://localhost:${PORT}/api/todos          — create a todo`);
    console.log(`  PATCH  http://localhost:${PORT}/api/todos/:id      — update a todo`);
    console.log("");
});
exports.default = app;
//# sourceMappingURL=index.js.map