"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoIdParamSchema = exports.updateTodoSchema = exports.createTodoSchema = void 0;
const zod_1 = require("zod");
exports.createTodoSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be at most 100 characters"),
    description: zod_1.z
        .string()
        .max(500, "Description must be at most 500 characters")
        .default(""),
});
exports.updateTodoSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100).optional(),
    description: zod_1.z.string().max(500).optional(),
    completed: zod_1.z.boolean().optional(),
});
exports.todoIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid todo ID format"),
});
//# sourceMappingURL=todo.js.map