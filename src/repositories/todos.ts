import { randomUUID } from "crypto";
import { getInMemoryState } from "./inMemoryState";
import type { Todo, TodoPriority, TodoRecord } from "../types/todo";

export interface TodoFilters {
  completed?: boolean;
  priority?: TodoPriority;
  categoryId?: string;
}

export interface CreateTodoRecordInput {
  userId: string;
  title: string;
  description: string;
  priority: TodoPriority;
  categoryId: string | null;
}

export interface UpdateTodoRecordInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: TodoPriority;
  categoryId?: string | null;
}

export const toTodo = ({ userId: _userId, ...todo }: TodoRecord): Todo => todo;

export const listTodosByUser = (
  userId: string,
  filters: TodoFilters,
): Todo[] => {
  return Array.from(getInMemoryState().todos.values())
    .filter((todo) => todo.userId === userId)
    .filter((todo) =>
      filters.completed === undefined
        ? true
        : todo.completed === filters.completed,
    )
    .filter((todo) =>
      filters.priority === undefined
        ? true
        : todo.priority === filters.priority,
    )
    .filter((todo) =>
      filters.categoryId === undefined
        ? true
        : todo.categoryId === filters.categoryId,
    )
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() -
        new Date(left.createdAt).getTime(),
    )
    .map(toTodo);
};

export const findTodoRecordById = (
  todoId: string,
  userId: string,
): TodoRecord | null => {
  const todo = getInMemoryState().todos.get(todoId);

  if (!todo || todo.userId !== userId) {
    return null;
  }

  return todo;
};

export const createTodo = (input: CreateTodoRecordInput): Todo => {
  const now = new Date().toISOString();
  const todoRecord: TodoRecord = {
    id: randomUUID(),
    userId: input.userId,
    title: input.title,
    description: input.description,
    completed: false,
    priority: input.priority,
    categoryId: input.categoryId,
    createdAt: now,
    updatedAt: now,
  };

  getInMemoryState().todos.set(todoRecord.id, todoRecord);

  return toTodo(todoRecord);
};

export const updateTodo = (
  todoId: string,
  userId: string,
  input: UpdateTodoRecordInput,
): Todo | null => {
  const currentTodo = findTodoRecordById(todoId, userId);

  if (!currentTodo) {
    return null;
  }

  const updatedTodo: TodoRecord = {
    ...currentTodo,
    ...input,
    updatedAt: new Date().toISOString(),
  };

  getInMemoryState().todos.set(todoId, updatedTodo);

  return toTodo(updatedTodo);
};

export const clearCategoryFromTodos = (
  userId: string,
  categoryId: string,
): number => {
  let updatedCount = 0;

  for (const [todoId, todo] of getInMemoryState().todos.entries()) {
    if (todo.userId !== userId || todo.categoryId !== categoryId) {
      continue;
    }

    getInMemoryState().todos.set(todoId, {
      ...todo,
      categoryId: null,
      updatedAt: new Date().toISOString(),
    });
    updatedCount += 1;
  }

  return updatedCount;
};
