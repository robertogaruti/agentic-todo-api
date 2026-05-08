import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  categoryIdParamSchema,
  createCategorySchema,
  updateCategorySchema,
} from "../../src/schemas/category";
import {
  createTodoSchema,
  listTodosQuerySchema,
  updateTodoSchema,
} from "../../src/schemas/todo";

describe("Schema validation", () => {
  it("should_apply_medium_priority_by_default_when_creating_a_todo", () => {
    const actResult = createTodoSchema.parse({ title: "Nuovo task" });

    assert.equal(actResult.priority, "medium");
    assert.equal(actResult.description, "");
  });

  it("should_accept_null_category_id_when_updating_a_todo", () => {
    const actResult = updateTodoSchema.parse({ categoryId: null });

    assert.equal(actResult.categoryId, null);
  });

  it("should_reject_invalid_priority_in_todo_filters", () => {
    const actResult = listTodosQuerySchema.safeParse({ priority: "critical" });

    assert.equal(actResult.success, false);
  });

  it("should_trim_category_name_before_persisting", () => {
    const actResult = createCategorySchema.parse({ name: "  Casa  " });

    assert.equal(actResult.name, "Casa");
  });

  it("should_validate_category_id_params", () => {
    const actResult = categoryIdParamSchema.parse({
      id: "33333333-3333-4333-8333-333333333333",
    });

    assert.equal(actResult.id, "33333333-3333-4333-8333-333333333333");
  });

  it("should_trim_category_name_when_updating_a_category", () => {
    const actResult = updateCategorySchema.parse({ name: "  Studio  " });

    assert.equal(actResult.name, "Studio");
  });
});
