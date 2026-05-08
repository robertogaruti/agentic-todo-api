import { Router, type Request, type Response } from "express";
import {
  createTodoSchema,
  listTodosQuerySchema,
  updateTodoSchema,
  todoIdParamSchema,
} from "../schemas/todo";
import { requireAuthenticatedUserId } from "../middleware/auth";
import { findCategoryRecordById } from "../repositories/categories";
import {
  createTodo,
  findTodoRecordById,
  listTodosByUser,
  updateTodo,
} from "../repositories/todos";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const userId = requireAuthenticatedUserId(req);
  const parsedQuery = listTodosQuerySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    res.status(400).json({
      error: "Validation failed",
      details: parsedQuery.error.issues,
    });
    return;
  }

  const result = listTodosByUser(userId, parsedQuery.data);

  res.json({ data: result, total: result.length });
});

router.post("/", (req: Request, res: Response) => {
  const userId = requireAuthenticatedUserId(req);
  const parsed = createTodoSchema.safeParse(req.body);

  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.issues });
    return;
  }

  if (
    parsed.data.categoryId !== undefined &&
    !findCategoryRecordById(parsed.data.categoryId, userId)
  ) {
    res.status(404).json({
      error: `Category with id "${parsed.data.categoryId}" not found`,
    });
    return;
  }

  const todo = createTodo({
    userId,
    title: parsed.data.title,
    description: parsed.data.description,
    priority: parsed.data.priority,
    categoryId: parsed.data.categoryId ?? null,
  });

  res.status(201).json({ data: todo });
});

router.patch("/:id", (req: Request, res: Response) => {
  const userId = requireAuthenticatedUserId(req);
  const paramParsed = todoIdParamSchema.safeParse(req.params);

  if (!paramParsed.success) {
    res
      .status(400)
      .json({ error: "Invalid ID", details: paramParsed.error.issues });
    return;
  }

  const { id } = paramParsed.data;
  const todo = findTodoRecordById(id, userId);

  if (!todo) {
    res.status(404).json({ error: `Todo with id "${id}" not found` });
    return;
  }

  const bodyParsed = updateTodoSchema.safeParse(req.body);

  if (!bodyParsed.success) {
    res.status(400).json({
      error: "Validation failed",
      details: bodyParsed.error.issues,
    });
    return;
  }

  if (
    bodyParsed.data.categoryId !== undefined &&
    bodyParsed.data.categoryId !== null &&
    !findCategoryRecordById(bodyParsed.data.categoryId, userId)
  ) {
    res.status(404).json({
      error: `Category with id "${bodyParsed.data.categoryId}" not found`,
    });
    return;
  }

  const updated = updateTodo(id, userId, bodyParsed.data);

  if (!updated) {
    res.status(404).json({ error: `Todo with id "${id}" not found` });
    return;
  }

  res.json({ data: updated });
});

export default router;
