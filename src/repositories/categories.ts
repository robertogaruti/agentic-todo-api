import { randomUUID } from "crypto";
import { getInMemoryState } from "./inMemoryState";
import type { Category, CategoryRecord } from "../types/category";

const normalizeCategoryName = (name: string): string =>
  name.trim().toLowerCase();

export const toCategory = ({
  userId: _userId,
  ...category
}: CategoryRecord): Category => category;

export const listCategoriesByUser = (userId: string): Category[] => {
  return Array.from(getInMemoryState().categories.values())
    .filter((category) => category.userId === userId)
    .sort((left, right) => left.name.localeCompare(right.name))
    .map(toCategory);
};

export const findCategoryRecordById = (
  categoryId: string,
  userId: string,
): CategoryRecord | null => {
  const category = getInMemoryState().categories.get(categoryId);

  if (!category || category.userId !== userId) {
    return null;
  }

  return category;
};

export const hasCategoryName = (
  userId: string,
  categoryName: string,
  excludedCategoryId?: string,
): boolean => {
  const normalizedCategoryName = normalizeCategoryName(categoryName);

  return Array.from(getInMemoryState().categories.values()).some(
    (category) =>
      category.userId === userId &&
      category.id !== excludedCategoryId &&
      normalizeCategoryName(category.name) === normalizedCategoryName,
  );
};

export const createCategory = (
  userId: string,
  categoryName: string,
): Category => {
  const now = new Date().toISOString();
  const categoryRecord: CategoryRecord = {
    id: randomUUID(),
    userId,
    name: categoryName.trim(),
    createdAt: now,
    updatedAt: now,
  };

  getInMemoryState().categories.set(categoryRecord.id, categoryRecord);

  return toCategory(categoryRecord);
};

export const updateCategory = (
  categoryId: string,
  userId: string,
  categoryName: string,
): Category | null => {
  const categoryRecord = findCategoryRecordById(categoryId, userId);

  if (!categoryRecord) {
    return null;
  }

  const updatedCategoryRecord: CategoryRecord = {
    ...categoryRecord,
    name: categoryName.trim(),
    updatedAt: new Date().toISOString(),
  };

  getInMemoryState().categories.set(categoryId, updatedCategoryRecord);

  return toCategory(updatedCategoryRecord);
};

export const deleteCategory = (categoryId: string, userId: string): boolean => {
  const categoryRecord = findCategoryRecordById(categoryId, userId);

  if (!categoryRecord) {
    return false;
  }

  return getInMemoryState().categories.delete(categoryId);
};
