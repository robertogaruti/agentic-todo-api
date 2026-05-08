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

describe("GET /api/todos filters", () => {
  beforeEach(() => {
    process.env["JWT_SECRET"] = "test-secret";
    resetInMemoryState();
  });

  it("should_return_todos_filtered_by_category_and_priority_when_both_filters_are_provided", async () => {
    const actResponse = await request(app)
      .get(`/api/todos?priority=high&categoryId=${DEMO_CATEGORY_IDS.work}`)
      .set("Authorization", createAuthHeader(DEMO_USER_ID));

    assert.equal(actResponse.status, 200);
    assert.equal(actResponse.body.total, 1);
    assert.equal(actResponse.body.data[0].title, "Learn TypeScript");
  });

  it("should_return_todos_filtered_by_priority_when_only_priority_is_provided", async () => {
    const actResponse = await request(app)
      .get("/api/todos?priority=medium")
      .set("Authorization", createAuthHeader(DEMO_USER_ID));

    assert.equal(actResponse.status, 200);
    assert.equal(actResponse.body.total, 1);
    assert.equal(actResponse.body.data[0].priority, "medium");
  });

  it("should_return_todos_filtered_by_category_when_only_category_is_provided", async () => {
    const actResponse = await request(app)
      .get(`/api/todos?categoryId=${DEMO_CATEGORY_IDS.personal}`)
      .set("Authorization", createAuthHeader(DEMO_USER_ID));

    assert.equal(actResponse.status, 200);
    assert.equal(actResponse.body.total, 1);
    assert.equal(
      actResponse.body.data[0].categoryId,
      DEMO_CATEGORY_IDS.personal,
    );
  });

  it("should_return_empty_collection_when_no_todos_match_filters", async () => {
    const actResponse = await request(app)
      .get(`/api/todos?priority=low&categoryId=${DEMO_CATEGORY_IDS.work}`)
      .set("Authorization", createAuthHeader(DEMO_USER_ID));

    assert.equal(actResponse.status, 200);
    assert.equal(actResponse.body.total, 0);
    assert.deepEqual(actResponse.body.data, []);
  });

  it("should_return_400_when_priority_query_value_is_invalid", async () => {
    const actResponse = await request(app)
      .get("/api/todos?priority=critical")
      .set("Authorization", createAuthHeader(DEMO_USER_ID));

    assert.equal(actResponse.status, 400);
    assert.equal(actResponse.body.error, "Validation failed");
  });

  it("should_not_leak_other_users_todos_even_when_filters_match", async () => {
    const actResponse = await request(app)
      .get(
        "/api/todos?priority=low&categoryId=66666666-6666-4666-8666-666666666666",
      )
      .set("Authorization", createAuthHeader(DEMO_USER_ID));

    assert.equal(actResponse.status, 200);
    assert.equal(actResponse.body.total, 0);
    assert.deepEqual(actResponse.body.data, []);
  });
});
