import { Router, type Request, type Response } from "express";
import {
  categoryIdParamSchema,
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/category";
import { requireAuthenticatedUserId } from "../middleware/auth";
import {
  createCategory,
  deleteCategory,
  findCategoryRecordById,
  hasCategoryName,
  listCategoriesByUser,
  updateCategory,
} from "../repositories/categories";
import { clearCategoryFromTodos } from "../repositories/todos";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const userId = requireAuthenticatedUserId(req);
  const categories = listCategoriesByUser(userId);

  res.json({ data: categories, total: categories.length });
});

router.post("/", (req: Request, res: Response) => {
  const userId = requireAuthenticatedUserId(req);
  const parsed = createCategorySchema.safeParse(req.body);

  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.issues });
    return;
  }

  if (hasCategoryName(userId, parsed.data.name)) {
    res
      .status(409)
      .json({ error: `Category \"${parsed.data.name}\" already exists` });
    return;
  }

  const category = createCategory(userId, parsed.data.name);

  res.status(201).json({ data: category });
});

router.patch("/:id", (req: Request, res: Response) => {
  const userId = requireAuthenticatedUserId(req);
  const parsedParams = categoryIdParamSchema.safeParse(req.params);

  if (!parsedParams.success) {
    res
      .status(400)
      .json({ error: "Invalid ID", details: parsedParams.error.issues });
    return;
  }

  const parsedBody = updateCategorySchema.safeParse(req.body);

  if (!parsedBody.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: parsedBody.error.issues });
    return;
  }

  if (!findCategoryRecordById(parsedParams.data.id, userId)) {
    res
      .status(404)
      .json({ error: `Category with id "${parsedParams.data.id}" not found` });
    return;
  }

  if (hasCategoryName(userId, parsedBody.data.name, parsedParams.data.id)) {
    res
      .status(409)
      .json({ error: `Category "${parsedBody.data.name}" already exists` });
    return;
  }

  const category = updateCategory(
    parsedParams.data.id,
    userId,
    parsedBody.data.name,
  );

  if (!category) {
    res
      .status(404)
      .json({ error: `Category with id "${parsedParams.data.id}" not found` });
    return;
  }

  res.json({ data: category });
});

router.delete("/:id", (req: Request, res: Response) => {
  const userId = requireAuthenticatedUserId(req);
  const parsedParams = categoryIdParamSchema.safeParse(req.params);

  if (!parsedParams.success) {
    res
      .status(400)
      .json({ error: "Invalid ID", details: parsedParams.error.issues });
    return;
  }

  if (!findCategoryRecordById(parsedParams.data.id, userId)) {
    res
      .status(404)
      .json({ error: `Category with id "${parsedParams.data.id}" not found` });
    return;
  }

  clearCategoryFromTodos(userId, parsedParams.data.id);
  deleteCategory(parsedParams.data.id, userId);

  res.status(204).send();
});

export default router;
