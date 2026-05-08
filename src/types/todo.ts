export const todoPriorities = ["low", "medium", "high"] as const;

export type TodoPriority = (typeof todoPriorities)[number];

export interface TodoRecord {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TodoPriority;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type Todo = Omit<TodoRecord, "userId">;
