"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryIdParamSchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
const categoryNameSchema = zod_1.z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(50, "Category name must be at most 50 characters");
exports.createCategorySchema = zod_1.z
    .object({
    name: categoryNameSchema,
})
    .strict();
exports.updateCategorySchema = zod_1.z
    .object({
    name: categoryNameSchema,
})
    .strict();
exports.categoryIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
//# sourceMappingURL=category.js.map