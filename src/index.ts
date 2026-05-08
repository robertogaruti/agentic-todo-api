import app from "./app";
import { assertAuthConfiguration } from "./config/auth";

const PORT = process.env["PORT"] ?? 3000;

assertAuthConfiguration();

app.listen(PORT, () => {
  console.log(`Todo API running at http://localhost:${PORT}`);
  console.log("");
  console.log("Endpoints:");
  console.log(
    `  GET    http://localhost:${PORT}/api/categories     - list categories`,
  );
  console.log(
    `  POST   http://localhost:${PORT}/api/categories     - create a category`,
  );
  console.log(
    `  PATCH  http://localhost:${PORT}/api/categories/:id - rename a category`,
  );
  console.log(
    `  DELETE http://localhost:${PORT}/api/categories/:id - delete a category`,
  );
  console.log(
    `  GET    http://localhost:${PORT}/api/todos          - list todos with filters`,
  );
  console.log(
    `  POST   http://localhost:${PORT}/api/todos          - create a todo`,
  );
  console.log(
    `  PATCH  http://localhost:${PORT}/api/todos/:id      - update a todo`,
  );
  console.log("");
});

export default app;
