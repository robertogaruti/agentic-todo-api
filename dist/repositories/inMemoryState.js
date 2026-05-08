"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetInMemoryState = exports.getInMemoryState = exports.DEMO_CATEGORY_IDS = exports.OTHER_USER_ID = exports.DEMO_USER_ID = void 0;
exports.DEMO_USER_ID = "11111111-1111-4111-8111-111111111111";
exports.OTHER_USER_ID = "22222222-2222-4222-8222-222222222222";
exports.DEMO_CATEGORY_IDS = {
    work: "33333333-3333-4333-8333-333333333333",
    personal: "44444444-4444-4444-8444-444444444444",
    urgent: "55555555-5555-4555-8555-555555555555",
    otherUser: "66666666-6666-4666-8666-666666666666",
};
const createSeedState = () => {
    const categories = new Map([
        [
            exports.DEMO_CATEGORY_IDS.work,
            {
                id: exports.DEMO_CATEGORY_IDS.work,
                userId: exports.DEMO_USER_ID,
                name: "Lavoro",
                createdAt: new Date("2026-05-01T10:00:00Z").toISOString(),
                updatedAt: new Date("2026-05-01T10:00:00Z").toISOString(),
            },
        ],
        [
            exports.DEMO_CATEGORY_IDS.personal,
            {
                id: exports.DEMO_CATEGORY_IDS.personal,
                userId: exports.DEMO_USER_ID,
                name: "Personale",
                createdAt: new Date("2026-05-02T10:00:00Z").toISOString(),
                updatedAt: new Date("2026-05-02T10:00:00Z").toISOString(),
            },
        ],
        [
            exports.DEMO_CATEGORY_IDS.urgent,
            {
                id: exports.DEMO_CATEGORY_IDS.urgent,
                userId: exports.DEMO_USER_ID,
                name: "Urgente",
                createdAt: new Date("2026-05-03T10:00:00Z").toISOString(),
                updatedAt: new Date("2026-05-03T10:00:00Z").toISOString(),
            },
        ],
        [
            exports.DEMO_CATEGORY_IDS.otherUser,
            {
                id: exports.DEMO_CATEGORY_IDS.otherUser,
                userId: exports.OTHER_USER_ID,
                name: "Segreto",
                createdAt: new Date("2026-05-04T10:00:00Z").toISOString(),
                updatedAt: new Date("2026-05-04T10:00:00Z").toISOString(),
            },
        ],
    ]);
    const todos = new Map([
        [
            "550e8400-e29b-41d4-a716-446655440000",
            {
                id: "550e8400-e29b-41d4-a716-446655440000",
                userId: exports.DEMO_USER_ID,
                title: "Learn TypeScript",
                description: "Study TypeScript strict mode and advanced types",
                completed: true,
                priority: "high",
                categoryId: exports.DEMO_CATEGORY_IDS.work,
                createdAt: new Date("2026-05-01T10:00:00Z").toISOString(),
                updatedAt: new Date("2026-05-03T14:00:00Z").toISOString(),
            },
        ],
        [
            "550e8400-e29b-41d4-a716-446655440001",
            {
                id: "550e8400-e29b-41d4-a716-446655440001",
                userId: exports.DEMO_USER_ID,
                title: "Build a REST API",
                description: "Create a Todo API with Express and Zod validation",
                completed: false,
                priority: "medium",
                categoryId: exports.DEMO_CATEGORY_IDS.personal,
                createdAt: new Date("2026-05-05T09:00:00Z").toISOString(),
                updatedAt: new Date("2026-05-05T09:00:00Z").toISOString(),
            },
        ],
        [
            "550e8400-e29b-41d4-a716-446655440002",
            {
                id: "550e8400-e29b-41d4-a716-446655440002",
                userId: exports.OTHER_USER_ID,
                title: "Private external task",
                description: "Should never leak to another user",
                completed: false,
                priority: "low",
                categoryId: exports.DEMO_CATEGORY_IDS.otherUser,
                createdAt: new Date("2026-05-06T09:00:00Z").toISOString(),
                updatedAt: new Date("2026-05-06T09:00:00Z").toISOString(),
            },
        ],
    ]);
    return { categories, todos };
};
let state = createSeedState();
const getInMemoryState = () => state;
exports.getInMemoryState = getInMemoryState;
const resetInMemoryState = () => {
    state = createSeedState();
};
exports.resetInMemoryState = resetInMemoryState;
//# sourceMappingURL=inMemoryState.js.map