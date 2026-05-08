import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import request from "supertest";
import app from "../../src/app";
import {
  DEMO_CATEGORY_IDS,
  DEMO_USER_ID,
  resetInMemoryState,
} from "../../src/repositories/inMemoryState";
import { createAuthHeader } from "../helpers/auth";

describe("PATCH /api/todos/:id", () => {
  beforeEach(() => {
    process.env["JWT_SECRET"] = "test-secret";
    resetInMemoryState();
  });

  it("should_update_todo_priority_and_category_when_request_is_valid", async () => {
    const arrangeTodoId = "550e8400-e29b-41d4-a716-446655440001";

    const actResponse = await request(app)
      .patch(`/api/todos/${arrangeTodoId}`)
      .set("Authorization", createAuthHeader(DEMO_USER_ID))
      .send({ priority: "high", categoryId: DEMO_CATEGORY_IDS.urgent });

    assert.equal(actResponse.status, 200);
    assert.equal(actResponse.body.data.priority, "high");
    assert.equal(actResponse.body.data.categoryId, DEMO_CATEGORY_IDS.urgent);
  });

  it("should_return_400_when_todo_id_is_invalid", async () => {
    const actResponse = await request(app)
      .patch("/api/todos/not-a-uuid")
      .set("Authorization", createAuthHeader(DEMO_USER_ID))
      .send({ completed: true });

    assert.equal(actResponse.status, 400);
    assert.equal(actResponse.body.error, "Invalid ID");
  });

  it("should_return_404_when_todo_does_not_exist", async () => {
    const actResponse = await request(app)
      .patch("/api/todos/99999999-9999-4999-8999-999999999999")
      .set("Authorization", createAuthHeader(DEMO_USER_ID))
      .send({ completed: true });

    assert.equal(actResponse.status, 404);
    assert.match(actResponse.body.error, /not found/i);
  });

  it("should_return_400_when_priority_is_invalid", async () => {
    const arrangeTodoId = "550e8400-e29b-41d4-a716-446655440001";

    const actResponse = await request(app)
      .patch(`/api/todos/${arrangeTodoId}`)
      .set("Authorization", createAuthHeader(DEMO_USER_ID))
      .send({ priority: "critical" });

    assert.equal(actResponse.status, 400);
    assert.equal(actResponse.body.error, "Validation failed");
  });

  it("should_return_404_when_category_id_is_not_accessible_to_user", async () => {
    const arrangeTodoId = "550e8400-e29b-41d4-a716-446655440001";

    const actResponse = await request(app)
      .patch(`/api/todos/${arrangeTodoId}`)
      .set("Authorization", createAuthHeader(DEMO_USER_ID))
      .send({ categoryId: "66666666-6666-4666-8666-666666666666" });

    assert.equal(actResponse.status, 404);
    assert.match(actResponse.body.error, /Category with id/i);
  });

  it("should_remove_category_when_category_id_is_null", async () => {
    const arrangeTodoId = "550e8400-e29b-41d4-a716-446655440001";

    const actResponse = await request(app)
      .patch(`/api/todos/${arrangeTodoId}`)
      .set("Authorization", createAuthHeader(DEMO_USER_ID))
      .send({ categoryId: null });

    assert.equal(actResponse.status, 200);
    assert.equal(actResponse.body.data.categoryId, null);
  });
});
