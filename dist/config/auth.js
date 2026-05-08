"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertAuthConfiguration = exports.getAuthConfig = void 0;
const DEFAULT_JWT_ISSUER = "agentic-todo-api";
const DEFAULT_JWT_AUDIENCE = "agentic-todo-api-users";
const getAuthConfig = () => {
    const secret = process.env["JWT_SECRET"];
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is required");
    }
    return {
        secret,
        issuer: process.env["JWT_ISSUER"] ?? DEFAULT_JWT_ISSUER,
        audience: process.env["JWT_AUDIENCE"] ?? DEFAULT_JWT_AUDIENCE,
    };
};
exports.getAuthConfig = getAuthConfig;
const assertAuthConfiguration = () => {
    (0, exports.getAuthConfig)();
};
exports.assertAuthConfiguration = assertAuthConfiguration;
//# sourceMappingURL=auth.js.map