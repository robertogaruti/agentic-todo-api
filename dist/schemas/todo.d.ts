import { z } from "zod";
export declare const createTodoSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodDefault<z.ZodString>;
    priority: z.ZodDefault<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>>;
    categoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const updateTodoSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    completed: z.ZodOptional<z.ZodBoolean>;
    priority: z.ZodOptional<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>>;
    categoryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const listTodosQuerySchema: z.ZodObject<{
    completed: z.ZodOptional<z.ZodPipe<z.ZodEnum<{
        true: "true";
        false: "false";
    }>, z.ZodTransform<boolean, "true" | "false">>>;
    priority: z.ZodOptional<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>>;
    categoryId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const todoIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type ListTodosQueryInput = z.infer<typeof listTodosQuerySchema>;
