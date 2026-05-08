import jwt from "jsonwebtoken";
import { getAuthConfig } from "../../src/config/auth";

export const createAuthHeader = (userId: string): string => {
  const authConfig = getAuthConfig();
  const token = jwt.sign({ sub: userId }, authConfig.secret, {
    expiresIn: "1h",
    issuer: authConfig.issuer,
    audience: authConfig.audience,
    algorithm: "HS256",
  });

  return `Bearer ${token}`;
};
