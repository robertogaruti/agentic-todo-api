import { z } from "zod";

const categoryNameSchema = z
  .string()
  .trim()
  .min(1, "Category name is required")
  .max(50, "Category name must be at most 50 characters");

export const createCategorySchema = z
  .object({
    name: categoryNameSchema,
  })
  .strict();

export const updateCategorySchema = z
  .object({
    name: categoryNameSchema,
  })
  .strict();

export const categoryIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
