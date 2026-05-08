# Title

feat: add authenticated category management, priorities and filters

# Summary

- harden JWT authentication with explicit secret requirement plus issuer and audience verification
- introduce user-scoped in-memory repositories for categories and todos
- extend category management with create, list, rename and delete operations
- keep todos filterable by category, priority and completion, and detach todo-category links when a category is deleted
- add integration and schema tests for happy paths and edge cases
- document the expanded API in README and OpenAPI

# Validation

- npm run build
- npm test

# Security Review

- validated all body, path and query inputs with Zod
- enforced user scoping for todos and categories to reduce broken access control risk
- required explicit JWT secret configuration and verified issuer and audience claims
- kept JWT identity only in verified bearer token claim `sub`
- limited JSON payload size to 100kb
