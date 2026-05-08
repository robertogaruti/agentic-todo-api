export interface CategoryRecord {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type Category = Omit<CategoryRecord, "userId">;
