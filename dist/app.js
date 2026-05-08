"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const categories_1 = __importDefault(require("./routes/categories"));
const todos_1 = __importDefault(require("./routes/todos"));
const auth_1 = require("./middleware/auth");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json({ limit: "100kb" }));
    app.get("/health", (_req, res) => {
        res.json({ status: "ok", timestamp: new Date().toISOString() });
    });
    app.use("/api/categories", auth_1.authenticateRequest, categories_1.default);
    app.use("/api/todos", auth_1.authenticateRequest, todos_1.default);
    app.use((_req, res) => {
        res.status(404).json({ error: "Route not found" });
    });
    return app;
};
exports.createApp = createApp;
const app = (0, exports.createApp)();
exports.default = app;
//# sourceMappingURL=app.js.map