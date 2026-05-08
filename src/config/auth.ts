export interface AuthConfig {
  secret: string;
  issuer: string;
  audience: string;
}

const DEFAULT_JWT_ISSUER = "agentic-todo-api";
const DEFAULT_JWT_AUDIENCE = "agentic-todo-api-users";

export const getAuthConfig = (): AuthConfig => {
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

export const assertAuthConfiguration = (): void => {
  getAuthConfig();
};
