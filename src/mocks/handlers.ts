import { rest } from "msw";

export const handlers = [
  // Handles a GET /user request
  rest.get("/api/todos", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(createTodoFixture(5)));
  }),
];

const createTodoFixture = (length: number) =>
  [...Array(length)].map((_, i) => ({
    id: i,
    text: `test todo ${Math.floor(Math.random() * 10000)}`,
  }));
