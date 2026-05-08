"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.hasCategoryName = exports.findCategoryRecordById = exports.listCategoriesByUser = exports.toCategory = void 0;
const crypto_1 = require("crypto");
const inMemoryState_1 = require("./inMemoryState");
const normalizeCategoryName = (name) => name.trim().toLowerCase();
const toCategory = ({ userId: _userId, ...category }) => category;
exports.toCategory = toCategory;
const listCategoriesByUser = (userId) => {
    return Array.from((0, inMemoryState_1.getInMemoryState)().categories.values())
        .filter((category) => category.userId === userId)
        .sort((left, right) => left.name.localeCompare(right.name))
        .map(exports.toCategory);
};
exports.listCategoriesByUser = listCategoriesByUser;
const findCategoryRecordById = (categoryId, userId) => {
    const category = (0, inMemoryState_1.getInMemoryState)().categories.get(categoryId);
    if (!category || category.userId !== userId) {
        return null;
    }
    return category;
};
exports.findCategoryRecordById = findCategoryRecordById;
const hasCategoryName = (userId, categoryName, excludedCategoryId) => {
    const normalizedCategoryName = normalizeCategoryName(categoryName);
    return Array.from((0, inMemoryState_1.getInMemoryState)().categories.values()).some((category) => category.userId === userId &&
        category.id !== excludedCategoryId &&
        normalizeCategoryName(category.name) === normalizedCategoryName);
};
exports.hasCategoryName = hasCategoryName;
const createCategory = (userId, categoryName) => {
    const now = new Date().toISOString();
    const categoryRecord = {
        id: (0, crypto_1.randomUUID)(),
        userId,
        name: categoryName.trim(),
        createdAt: now,
        updatedAt: now,
    };
    (0, inMemoryState_1.getInMemoryState)().categories.set(categoryRecord.id, categoryRecord);
    return (0, exports.toCategory)(categoryRecord);
};
exports.createCategory = createCategory;
const updateCategory = (categoryId, userId, categoryName) => {
    const categoryRecord = (0, exports.findCategoryRecordById)(categoryId, userId);
    if (!categoryRecord) {
        return null;
    }
    const updatedCategoryRecord = {
        ...categoryRecord,
        name: categoryName.trim(),
        updatedAt: new Date().toISOString(),
    };
    (0, inMemoryState_1.getInMemoryState)().categories.set(categoryId, updatedCategoryRecord);
    return (0, exports.toCategory)(updatedCategoryRecord);
};
exports.updateCategory = updateCategory;
const deleteCategory = (categoryId, userId) => {
    const categoryRecord = (0, exports.findCategoryRecordById)(categoryId, userId);
    if (!categoryRecord) {
        return false;
    }
    return (0, inMemoryState_1.getInMemoryState)().categories.delete(categoryId);
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=categories.js.map