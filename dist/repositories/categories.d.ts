import type { Category, CategoryRecord } from "../types/category";
export declare const toCategory: ({ userId: _userId, ...category }: CategoryRecord) => Category;
export declare const listCategoriesByUser: (userId: string) => Category[];
export declare const findCategoryRecordById: (categoryId: string, userId: string) => CategoryRecord | null;
export declare const hasCategoryName: (userId: string, categoryName: string, excludedCategoryId?: string) => boolean;
export declare const createCategory: (userId: string, categoryName: string) => Category;
export declare const updateCategory: (categoryId: string, userId: string, categoryName: string) => Category | null;
export declare const deleteCategory: (categoryId: string, userId: string) => boolean;
