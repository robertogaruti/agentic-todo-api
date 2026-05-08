"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCategoryFromTodos = exports.updateTodo = exports.createTodo = exports.findTodoRecordById = exports.listTodosByUser = exports.toTodo = void 0;
const crypto_1 = require("crypto");
const inMemoryState_1 = require("./inMemoryState");
const toTodo = ({ userId: _userId, ...todo }) => todo;
exports.toTodo = toTodo;
const listTodosByUser = (userId, filters) => {
    return Array.from((0, inMemoryState_1.getInMemoryState)().todos.values())
        .filter((todo) => todo.userId === userId)
        .filter((todo) => filters.completed === undefined
        ? true
        : todo.completed === filters.completed)
        .filter((todo) => filters.priority === undefined
        ? true
        : todo.priority === filters.priority)
        .filter((todo) => filters.categoryId === undefined
        ? true
        : todo.categoryId === filters.categoryId)
        .sort((left, right) => new Date(right.createdAt).getTime() -
        new Date(left.createdAt).getTime())
        .map(exports.toTodo);
};
exports.listTodosByUser = listTodosByUser;
const findTodoRecordById = (todoId, userId) => {
    const todo = (0, inMemoryState_1.getInMemoryState)().todos.get(todoId);
    if (!todo || todo.userId !== userId) {
        return null;
    }
    return todo;
};
exports.findTodoRecordById = findTodoRecordById;
const createTodo = (input) => {
    const now = new Date().toISOString();
    const todoRecord = {
        id: (0, crypto_1.randomUUID)(),
        userId: input.userId,
        title: input.title,
        description: input.description,
        completed: false,
        priority: input.priority,
        categoryId: input.categoryId,
        createdAt: now,
        updatedAt: now,
    };
    (0, inMemoryState_1.getInMemoryState)().todos.set(todoRecord.id, todoRecord);
    return (0, exports.toTodo)(todoRecord);
};
exports.createTodo = createTodo;
const updateTodo = (todoId, userId, input) => {
    const currentTodo = (0, exports.findTodoRecordById)(todoId, userId);
    if (!currentTodo) {
        return null;
    }
    const updatedTodo = {
        ...currentTodo,
        ...input,
        updatedAt: new Date().toISOString(),
    };
    (0, inMemoryState_1.getInMemoryState)().todos.set(todoId, updatedTodo);
    return (0, exports.toTodo)(updatedTodo);
};
exports.updateTodo = updateTodo;
const clearCategoryFromTodos = (userId, categoryId) => {
    let updatedCount = 0;
    for (const [todoId, todo] of (0, inMemoryState_1.getInMemoryState)().todos.entries()) {
        if (todo.userId !== userId || todo.categoryId !== categoryId) {
            continue;
        }
        (0, inMemoryState_1.getInMemoryState)().todos.set(todoId, {
            ...todo,
            categoryId: null,
            updatedAt: new Date().toISOString(),
        });
        updatedCount += 1;
    }
    return updatedCount;
};
exports.clearCategoryFromTodos = clearCategoryFromTodos;
//# sourceMappingURL=todos.js.map