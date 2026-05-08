import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { getAuthConfig } from "../config/auth";

const authTokenPayloadSchema = z.object({
  sub: z.string().uuid(),
});

const getBearerToken = (headerValue: string | undefined): string | null => {
  if (!headerValue) {
    return null;
  }

  const [scheme, token] = headerValue.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

export const authenticateRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = getBearerToken(req.header("authorization"));

  if (!token) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  let authConfig: ReturnType<typeof getAuthConfig>;

  try {
    authConfig = getAuthConfig();
  } catch {
    res.status(500).json({ error: "Authentication is not configured" });
    return;
  }

  try {
    const payload = jwt.verify(token, authConfig.secret, {
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
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireAuthenticatedUserId = (req: Request): string => {
  if (!req.auth) {
    throw new Error("Authenticated user context is missing");
  }

  return req.auth.userId;
};
