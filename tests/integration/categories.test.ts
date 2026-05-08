import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import request from "supertest";
import app from "../../src/app";
import {
  DEMO_CATEGORY_IDS,
  DEMO_USER_ID,
  OTHER_USER_ID,
  resetInMemoryState,
} from "../../src/repositories/inMemoryState";
import { createAuthHeader } from "../helpers/auth";

describe("Category routes", () => {
  beforeEach(() => {
    process.env["JWT_SECRET"] = "test-secret";
    process.env["JWT_ISSUER"] = "agentic-todo-api";
    process.env["JWT_AUDIENCE"] = "agentic-todo-api-users";
    resetInMemoryState();
  });

  describe("POST /api/categories", () => {
    it("should_create_category_when_request_is_authenticated_and_payload_is_valid", async () => {
      const arrangePayload = { name: "Casa" };

      const actResponse = await request(app)
        .post("/api/categories")
        .set("Authorization", createAuthHeader(DEMO_USER_ID))
        .send(arrangePayload);

      assert.equal(actResponse.status, 201);
      assert.equal(actResponse.body.data.name, "Casa");
      assert.match(actResponse.body.data.id, /^[0-9a-f-]{36}$/i);
    });

    it("should_return_401_when_authorization_header_is_missing", async () => {
      const actResponse = await request(app)
        .post("/api/categories")
        .send({ name: "Casa" });

      assert.equal(actResponse.status, 401);
      assert.equal(
        actResponse.body.error,
        "Missing or invalid Authorization header",
      );
    });

    it("should_return_400_when_name_is_blank_after_trimming", async () => {
      const actResponse = await request(app)
        .post("/api/categories")
        .set("Authorization", createAuthHeader(DEMO_USER_ID))
        .send({ name: "   " });

      assert.equal(actResponse.status, 400);
      assert.equal(actResponse.body.error, "Validation failed");
    });

    it("should_return_400_when_name_exceeds_max_length", async () => {
      const arrangePayload = { name: "x".repeat(51) };

      const actResponse = await request(app)
        .post("/api/categories")
        .set("Authorization", createAuthHeader(DEMO_USER_ID))
        .send(arrangePayload);

      assert.equal(actResponse.status, 400);
      assert.equal(actResponse.body.error, "Validation failed");
    });

    it("should_return_409_when_category_name_already_exists_for_same_user", async () => {
      const actResponse = await request(app)
        .post("/api/categories")
        .set("Authorization", createAuthHeader(DEMO_USER_ID))
        .send({ name: " lavoro " });

      assert.equal(actResponse.status, 409);
      assert.match(actResponse.body.error, /already exists/i);
    });
  });

  describe("GET /api/categories", () => {
    it("should_return_only_categories_owned_by_authenticated_user", async () => {
      const actResponse = await request(app)
        .get("/api/categories")
        .set("Authorization", createAuthHeader(DEMO_USER_ID));

      assert.equal(actResponse.status, 200);
      assert.equal(actResponse.body.total, 3);
      assert.deepEqual(
        actResponse.body.data.map(
          (category: { name: string }) => category.name,
        ),
        ["Lavoro", "Personale", "Urgente"],
      );
    });

    it("should_return_401_when_request_is_unauthenticated", async () => {
      const actResponse = await request(app).get("/api/categories");

      assert.equal(actResponse.status, 401);
    });

    it("should_return_empty_collection_when_user_has_no_categories", async () => {
      const emptyUserId = "77777777-7777-4777-8777-777777777777";

      const actResponse = await request(app)
        .get("/api/categories")
        .set("Authorization", createAuthHeader(emptyUserId));

      assert.equal(actResponse.status, 200);
      assert.equal(actResponse.body.total, 0);
      assert.deepEqual(actResponse.body.data, []);
    });

    it("should_not_return_categories_owned_by_another_user", async () => {
      const actResponse = await request(app)
        .get("/api/categories")
        .set("Authorization", createAuthHeader(OTHER_USER_ID));

      assert.equal(actResponse.status, 200);
      assert.equal(actResponse.body.total, 1);
      assert.equal(actResponse.body.data[0].name, "Segreto");
    });
  });

  describe("PATCH /api/categories/:id", () => {
    it("should_update_category_name_when_request_is_valid", async () => {
      const actResponse = await request(app)
        .patch(`/api/categories/${DEMO_CATEGORY_IDS.personal}`)
        .set("Authorization", createAuthHeader(DEMO_USER_ID))
        .send({ name: "Studio" });

      assert.equal(actResponse.status, 200);
      assert.equal(actResponse.body.data.name, "Studio");
    });

    it("should_return_400_when_category_id_is_invalid", async () => {
      const actResponse = await request(app)
        .patch("/api/categories/not-a-uuid")
        .set("Authorization", createAuthHeader(DEMO_USER_ID))
        .send({ name: "Studio" });

      assert.equal(actResponse.status, 400);
      assert.equal(actResponse.body.error, "Invalid ID");
    });

    it("should_return_400_when_name_is_invalid", async () => {
      const actResponse = await request(app)
        .patch(`/api/categories/${DEMO_CATEGORY_IDS.personal}`)
        .set("Authorization", createAuthHeader(DEMO_USER_ID))
        .send({ name: "  " });

      assert.equal(actResponse.status, 400);
      assert.equal(actResponse.body.error, "Validation failed");
    });

    it("should_return_404_when_category_is_not_found_in_user_scope", async () => {
      const actResponse = await request(app)
        .patch(`/api/categories/${DEMO_CATEGORY_IDS.otherUser}`)
        .set("Authorization", createAuthHeader(DEMO_USER_ID))
        .send({ name: "Studio" });

      assert.equal(actResponse.status, 404);
      assert.match(actResponse.body.error, /not found/i);
    });

    it("should_return_409_when_updated_name_conflicts_with_existing_user_category", async () => {
      const actResponse = await request(app)
        .patch(`/api/categories/${DEMO_CATEGORY_IDS.personal}`)
        .set("Authorization", createAuthHeader(DEMO_USER_ID))
        .send({ name: "Lavoro" });

      assert.equal(actResponse.status, 409);
      assert.match(actResponse.body.error, /already exists/i);
    });
  });

  describe("DELETE /api/categories/:id", () => {
    it("should_delete_category_and_clear_related_todo_category_ids", async () => {
      const deleteResponse = await request(app)
        .delete(`/api/categories/${DEMO_CATEGORY_IDS.personal}`)
        .set("Authorization", createAuthHeader(DEMO_USER_ID));

      assert.equal(deleteResponse.status, 204);

      const categoriesResponse = await request(app)
        .get("/api/categories")
        .set("Authorization", createAuthHeader(DEMO_USER_ID));

      assert.equal(categoriesResponse.body.total, 2);

      const todosResponse = await request(app)
        .get("/api/todos")
        .set("Authorization", createAuthHeader(DEMO_USER_ID));

      const updatedTodo = todosResponse.body.data.find(
        (todo: { id: string; categoryId: string | null }) =>
          todo.id === "550e8400-e29b-41d4-a716-446655440001",
      );

      assert.equal(updatedTodo?.categoryId, null);
    });

    it("should_return_400_when_delete_category_id_is_invalid", async () => {
      const actResponse = await request(app)
        .delete("/api/categories/not-a-uuid")
        .set("Authorization", createAuthHeader(DEMO_USER_ID));

      assert.equal(actResponse.status, 400);
      assert.equal(actResponse.body.error, "Invalid ID");
    });

    it("should_return_404_when_category_to_delete_is_not_found", async () => {
      const actResponse = await request(app)
        .delete(`/api/categories/${DEMO_CATEGORY_IDS.otherUser}`)
        .set("Authorization", createAuthHeader(DEMO_USER_ID));

      assert.equal(actResponse.status, 404);
      assert.match(actResponse.body.error, /not found/i);
    });

    it("should_return_401_when_delete_request_is_unauthenticated", async () => {
      const actResponse = await request(app).delete(
        `/api/categories/${DEMO_CATEGORY_IDS.personal}`,
      );

      assert.equal(actResponse.status, 401);
    });
  });
});
