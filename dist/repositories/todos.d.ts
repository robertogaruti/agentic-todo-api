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
export declare const toTodo: ({ userId: _userId, ...todo }: TodoRecord) => Todo;
export declare const listTodosByUser: (userId: string, filters: TodoFilters) => Todo[];
export declare const findTodoRecordById: (todoId: string, userId: string) => TodoRecord | null;
export declare const createTodo: (input: CreateTodoRecordInput) => Todo;
export declare const updateTodo: (todoId: string, userId: string, input: UpdateTodoRecordInput) => Todo | null;
export declare const clearCategoryFromTodos: (userId: string, categoryId: string) => number;
