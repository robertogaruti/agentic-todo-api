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

describe("POST /api/todos", () => {
  beforeEach(() => {
    process.env["JWT_SECRET"] = "test-secret";
    resetInMemoryState();
  });

  it("should_create_todo_with_priority_and_category_when_payload_is_valid", async () => {
    const arrangePayload = {
      title: "Preparare la demo",
      description: "Allineare i task del team",
      priority: "high",
      categoryId: DEMO_CATEGORY_IDS.work,
    };

    const actResponse = await request(app)
      .post("/api/todos")
      .set("Authorization", createAuthHeader(DEMO_USER_ID))
      .send(arrangePayload);

    assert.equal(actResponse.status, 201);
    assert.equal(actResponse.body.data.priority, "high");
    assert.equal(actResponse.body.data.categoryId, DEMO_CATEGORY_IDS.work);
    assert.equal(actResponse.body.data.completed, false);
  });

  it("should_return_401_when_request_is_unauthenticated", async () => {
    const actResponse = await request(app)
      .post("/api/todos")
      .send({ title: "Task senza token" });

    assert.equal(actResponse.status, 401);
  });

  it("should_return_400_when_priority_is_not_low_medium_or_high", async () => {
    const actResponse = await request(app)
      .post("/api/todos")
      .set("Authorization", createAuthHeader(DEMO_USER_ID))
      .send({ title: "Task invalido", priority: "urgent" });

    assert.equal(actResponse.status, 400);
    assert.equal(actResponse.body.error, "Validation failed");
  });

  it("should_return_404_when_category_id_does_not_exist_in_user_scope", async () => {
    const actResponse = await request(app)
      .post("/api/todos")
      .set("Authorization", createAuthHeader(DEMO_USER_ID))
      .send({
        title: "Task orfano",
        categoryId: "88888888-8888-4888-8888-888888888888",
      });

    assert.equal(actResponse.status, 404);
    assert.match(actResponse.body.error, /Category with id/i);
  });

  it("should_default_priority_to_medium_when_not_provided", async () => {
    const actResponse = await request(app)
      .post("/api/todos")
      .set("Authorization", createAuthHeader(DEMO_USER_ID))
      .send({ title: "Task di default" });

    assert.equal(actResponse.status, 201);
    assert.equal(actResponse.body.data.priority, "medium");
    assert.equal(actResponse.body.data.categoryId, null);
  });
});
