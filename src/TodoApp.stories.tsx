import { rest } from "msw";
import TodoApp from "./TodoApp";

export default { component: TodoApp };

export const ApiSuccess = {};

export const ApiError = {
  parameters: {
    msw: [
      rest.get("/api/todos", (_req, res, ctx) =>
        res(
          ctx.status(500),
          ctx.json({
            message: "test error",
          })
        )
      ),
    ],
  },
};
