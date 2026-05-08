"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_1 = require("../schemas/category");
const auth_1 = require("../middleware/auth");
const categories_1 = require("../repositories/categories");
const todos_1 = require("../repositories/todos");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    const userId = (0, auth_1.requireAuthenticatedUserId)(req);
    const categories = (0, categories_1.listCategoriesByUser)(userId);
    res.json({ data: categories, total: categories.length });
});
router.post("/", (req, res) => {
    const userId = (0, auth_1.requireAuthenticatedUserId)(req);
    const parsed = category_1.createCategorySchema.safeParse(req.body);
    if (!parsed.success) {
        res
            .status(400)
            .json({ error: "Validation failed", details: parsed.error.issues });
        return;
    }
    if ((0, categories_1.hasCategoryName)(userId, parsed.data.name)) {
        res
            .status(409)
            .json({ error: `Category \"${parsed.data.name}\" already exists` });
        return;
    }
    const category = (0, categories_1.createCategory)(userId, parsed.data.name);
    res.status(201).json({ data: category });
});
router.patch("/:id", (req, res) => {
    const userId = (0, auth_1.requireAuthenticatedUserId)(req);
    const parsedParams = category_1.categoryIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
        res
            .status(400)
            .json({ error: "Invalid ID", details: parsedParams.error.issues });
        return;
    }
    const parsedBody = category_1.updateCategorySchema.safeParse(req.body);
    if (!parsedBody.success) {
        res
            .status(400)
            .json({ error: "Validation failed", details: parsedBody.error.issues });
        return;
    }
    if (!(0, categories_1.findCategoryRecordById)(parsedParams.data.id, userId)) {
        res
            .status(404)
            .json({ error: `Category with id "${parsedParams.data.id}" not found` });
        return;
    }
    if ((0, categories_1.hasCategoryName)(userId, parsedBody.data.name, parsedParams.data.id)) {
        res
            .status(409)
            .json({ error: `Category "${parsedBody.data.name}" already exists` });
        return;
    }
    const category = (0, categories_1.updateCategory)(parsedParams.data.id, userId, parsedBody.data.name);
    if (!category) {
        res
            .status(404)
            .json({ error: `Category with id "${parsedParams.data.id}" not found` });
        return;
    }
    res.json({ data: category });
});
router.delete("/:id", (req, res) => {
    const userId = (0, auth_1.requireAuthenticatedUserId)(req);
    const parsedParams = category_1.categoryIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
        res
            .status(400)
            .json({ error: "Invalid ID", details: parsedParams.error.issues });
        return;
    }
    if (!(0, categories_1.findCategoryRecordById)(parsedParams.data.id, userId)) {
        res
            .status(404)
            .json({ error: `Category with id "${parsedParams.data.id}" not found` });
        return;
    }
    (0, todos_1.clearCategoryFromTodos)(userId, parsedParams.data.id);
    (0, categories_1.deleteCategory)(parsedParams.data.id, userId);
    res.status(204).send();
});
exports.default = router;
//# sourceMappingURL=categories.js.map