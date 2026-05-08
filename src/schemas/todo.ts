import { z } from "zod";
import { todoPriorities } from "../types/todo";

const prioritySchema = z.enum(todoPriorities);
const categoryIdSchema = z.string().uuid();

export const createTodoSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(100, "Title must be at most 100 characters"),
    description: z
      .string()
      .trim()
      .max(500, "Description must be at most 500 characters")
      .default(""),
    priority: prioritySchema.default("medium"),
    categoryId: categoryIdSchema.optional(),
  })
  .strict();

export const updateTodoSchema = z
  .object({
    title: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(500).optional(),
    completed: z.boolean().optional(),
    priority: prioritySchema.optional(),
    categoryId: categoryIdSchema.nullable().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const listTodosQuerySchema = z
  .object({
    completed: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
    priority: prioritySchema.optional(),
    categoryId: categoryIdSchema.optional(),
  })
  .strict();

export const todoIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type ListTodosQueryInput = z.infer<typeof listTodosQuerySchema>;
