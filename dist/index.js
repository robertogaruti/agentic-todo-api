"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const auth_1 = require("./config/auth");
const PORT = process.env["PORT"] ?? 3000;
(0, auth_1.assertAuthConfiguration)();
app_1.default.listen(PORT, () => {
    console.log(`Todo API running at http://localhost:${PORT}`);
    console.log("");
    console.log("Endpoints:");
    console.log(`  GET    http://localhost:${PORT}/api/categories     - list categories`);
    console.log(`  POST   http://localhost:${PORT}/api/categories     - create a category`);
    console.log(`  PATCH  http://localhost:${PORT}/api/categories/:id - rename a category`);
    console.log(`  DELETE http://localhost:${PORT}/api/categories/:id - delete a category`);
    console.log(`  GET    http://localhost:${PORT}/api/todos          - list todos with filters`);
    console.log(`  POST   http://localhost:${PORT}/api/todos          - create a todo`);
    console.log(`  PATCH  http://localhost:${PORT}/api/todos/:id      - update a todo`);
    console.log("");
});
exports.default = app_1.default;
//# sourceMappingURL=index.js.map