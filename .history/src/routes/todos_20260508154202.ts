import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import type { Todo } from '../types/todo';
import { createTodoSchema, updateTodoSchema, todoIdParamSchema } from '../schemas/todo';

const router = Router();

// In-memory store (demo only)
const todos: Map<string, Todo> = new Map([
  [
    '550e8400-e29b-41d4-a716-446655440000',
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Learn TypeScript',
      description: 'Study TypeScript strict mode and advanced types',
      completed: true,
      createdAt: new Date('2026-05-01T10:00:00Z').toISOString(),
      updatedAt: new Date('2026-05-03T14:00:00Z').toISOString(),
    },
  ],
  [
    '550e8400-e29b-41d4-a716-446655440001',
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'Build a REST API',
      description: 'Create a Todo API with Express and Zod validation',
      completed: false,
      createdAt: new Date('2026-05-05T09:00:00Z').toISOString(),
      updatedAt: new Date('2026-05-05T09:00:00Z').toISOString(),
    },
  ],
]);

/**
 * GET /api/todos
 * Returns all todos. Supports optional ?completed=true|false filter.
 */
router.get('/', (req: Request, res: Response) => {
  const { completed } = req.query;

  let result = Array.from(todos.values());

  if (completed !== undefined) {
    const filterCompleted = completed === 'true';
    result = result.filter((t) => t.completed === filterCompleted);
  }

  // Sort by creation date descending
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ data: result, total: result.length });
});

/**
 * POST /api/todos
 * Creates a new todo. Body: { title, description? }
 */
router.post('/', (req: Request, res: Response) => {
  const parsed = createTodoSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    return;
  }

  const now = new Date().toISOString();
  const todo: Todo = {
    id: randomUUID(),
    title: parsed.data.title,
    description: parsed.data.description,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  todos.set(todo.id, todo);

  res.status(201).json({ data: todo });
});

/**
 * PATCH /api/todos/:id
 * Updates a todo's fields or toggles its completed status.
 * Body: { title?, description?, completed? }
 */
router.patch('/:id', (req: Request, res: Response) => {
  const paramParsed = todoIdParamSchema.safeParse(req.params);

  if (!paramParsed.success) {
    res.status(400).json({ error: 'Invalid ID', details: paramParsed.error.flatten() });
    return;
  }

  const { id } = paramParsed.data;
  const todo = todos.get(id);

  if (!todo) {
    res.status(404).json({ error: `Todo with id "${id}" not found` });
    return;
  }

  const bodyParsed = updateTodoSchema.safeParse(req.body);

  if (!bodyParsed.success) {
    res.status(400).json({ error: 'Validation failed', details: bodyParsed.error.flatten() });
    return;
  }

  const updated: Todo = {
    ...todo,
    ...bodyParsed.data,
    updatedAt: new Date().toISOString(),
  };

  todos.set(id, updated);

  res.json({ data: updated });
});

export default router;
