"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todo_1 = require("../schemas/todo");
const auth_1 = require("../middleware/auth");
const categories_1 = require("../repositories/categories");
const todos_1 = require("../repositories/todos");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    const userId = (0, auth_1.requireAuthenticatedUserId)(req);
    const parsedQuery = todo_1.listTodosQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
        res.status(400).json({
            error: "Validation failed",
            details: parsedQuery.error.issues,
        });
        return;
    }
    const result = (0, todos_1.listTodosByUser)(userId, parsedQuery.data);
    res.json({ data: result, total: result.length });
});
router.post("/", (req, res) => {
    const userId = (0, auth_1.requireAuthenticatedUserId)(req);
    const parsed = todo_1.createTodoSchema.safeParse(req.body);
    if (!parsed.success) {
        res
            .status(400)
            .json({ error: "Validation failed", details: parsed.error.issues });
        return;
    }
    if (parsed.data.categoryId !== undefined &&
        !(0, categories_1.findCategoryRecordById)(parsed.data.categoryId, userId)) {
        res.status(404).json({
            error: `Category with id "${parsed.data.categoryId}" not found`,
        });
        return;
    }
    const todo = (0, todos_1.createTodo)({
        userId,
        title: parsed.data.title,
        description: parsed.data.description,
        priority: parsed.data.priority,
        categoryId: parsed.data.categoryId ?? null,
    });
    res.status(201).json({ data: todo });
});
router.patch("/:id", (req, res) => {
    const userId = (0, auth_1.requireAuthenticatedUserId)(req);
    const paramParsed = todo_1.todoIdParamSchema.safeParse(req.params);
    if (!paramParsed.success) {
        res
            .status(400)
            .json({ error: "Invalid ID", details: paramParsed.error.issues });
        return;
    }
    const { id } = paramParsed.data;
    const todo = (0, todos_1.findTodoRecordById)(id, userId);
    if (!todo) {
        res.status(404).json({ error: `Todo with id "${id}" not found` });
        return;
    }
    const bodyParsed = todo_1.updateTodoSchema.safeParse(req.body);
    if (!bodyParsed.success) {
        res.status(400).json({
            error: "Validation failed",
            details: bodyParsed.error.issues,
        });
        return;
    }
    if (bodyParsed.data.categoryId !== undefined &&
        bodyParsed.data.categoryId !== null &&
        !(0, categories_1.findCategoryRecordById)(bodyParsed.data.categoryId, userId)) {
        res.status(404).json({
            error: `Category with id "${bodyParsed.data.categoryId}" not found`,
        });
        return;
    }
    const updated = (0, todos_1.updateTodo)(id, userId, bodyParsed.data);
    if (!updated) {
        res.status(404).json({ error: `Todo with id "${id}" not found` });
        return;
    }
    res.json({ data: updated });
});
exports.default = router;
//# sourceMappingURL=todos.js.map