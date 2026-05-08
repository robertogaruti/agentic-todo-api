"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoIdParamSchema = exports.listTodosQuerySchema = exports.updateTodoSchema = exports.createTodoSchema = void 0;
const zod_1 = require("zod");
const todo_1 = require("../types/todo");
const prioritySchema = zod_1.z.enum(todo_1.todoPriorities);
const categoryIdSchema = zod_1.z.string().uuid();
exports.createTodoSchema = zod_1.z
    .object({
    title: zod_1.z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(100, "Title must be at most 100 characters"),
    description: zod_1.z
        .string()
        .trim()
        .max(500, "Description must be at most 500 characters")
        .default(""),
    priority: prioritySchema.default("medium"),
    categoryId: categoryIdSchema.optional(),
})
    .strict();
exports.updateTodoSchema = zod_1.z
    .object({
    title: zod_1.z.string().trim().min(1).max(100).optional(),
    description: zod_1.z.string().trim().max(500).optional(),
    completed: zod_1.z.boolean().optional(),
    priority: prioritySchema.optional(),
    categoryId: categoryIdSchema.nullable().optional(),
})
    .strict()
    .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
});
exports.listTodosQuerySchema = zod_1.z
    .object({
    completed: zod_1.z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
    priority: prioritySchema.optional(),
    categoryId: categoryIdSchema.optional(),
})
    .strict();
exports.todoIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
//# sourceMappingURL=todo.js.map