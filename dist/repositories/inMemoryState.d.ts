import type { CategoryRecord } from "../types/category";
import type { TodoRecord } from "../types/todo";
export declare const DEMO_USER_ID = "11111111-1111-4111-8111-111111111111";
export declare const OTHER_USER_ID = "22222222-2222-4222-8222-222222222222";
export declare const DEMO_CATEGORY_IDS: {
    readonly work: "33333333-3333-4333-8333-333333333333";
    readonly personal: "44444444-4444-4444-8444-444444444444";
    readonly urgent: "55555555-5555-4555-8555-555555555555";
    readonly otherUser: "66666666-6666-4666-8666-666666666666";
};
export interface InMemoryState {
    categories: Map<string, CategoryRecord>;
    todos: Map<string, TodoRecord>;
}
export declare const getInMemoryState: () => InMemoryState;
export declare const resetInMemoryState: () => void;
