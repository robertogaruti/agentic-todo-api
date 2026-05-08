"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuthenticatedUserId = exports.authenticateRequest = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const auth_1 = require("../config/auth");
const authTokenPayloadSchema = zod_1.z.object({
    sub: zod_1.z.string().uuid(),
});
const getBearerToken = (headerValue) => {
    if (!headerValue) {
        return null;
    }
    const [scheme, token] = headerValue.split(" ");
    if (scheme !== "Bearer" || !token) {
        return null;
    }
    return token;
};
const authenticateRequest = (req, res, next) => {
    const token = getBearerToken(req.header("authorization"));
    if (!token) {
        res.status(401).json({ error: "Missing or invalid Authorization header" });
        return;
    }
    let authConfig;
    try {
        authConfig = (0, auth_1.getAuthConfig)();
    }
    catch {
        res.status(500).json({ error: "Authentication is not configured" });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, authConfig.secret, {
            algorithms: ["HS256"],
            issuer: authConfig.issuer,
            audience: authConfig.audience,
        });
        const parsedPayload = authTokenPayloadSchema.safeParse(payload);
        if (!parsedPayload.success) {
            res.status(401).json({ error: "Invalid token payload" });
            return;
        }
        req.auth = { userId: parsedPayload.data.sub };
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};
exports.authenticateRequest = authenticateRequest;
const requireAuthenticatedUserId = (req) => {
    if (!req.auth) {
        throw new Error("Authenticated user context is missing");
    }
    return req.auth.userId;
};
exports.requireAuthenticatedUserId = requireAuthenticatedUserId;
//# sourceMappingURL=auth.js.map