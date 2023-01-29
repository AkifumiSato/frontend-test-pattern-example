import { render, screen } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./App.stories";
import { SWRConfig } from "swr";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Todo } from "./App";

const server = setupServer();
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const { TodoApp } = composeStories(stories);

describe("TodoApp", () => {
  test("APIが呼び出され、取得結果が表示されること", async () => {
    // Arrange
    const fixture: Todo[] = [
      {
        id: 0,
        text: "test message",
      },
    ];
    const todoApiCall = jest.fn();
    server.use(
      rest.get("/api/todos", (_req, res, ctx) => {
        todoApiCall();
        return res(ctx.status(200), ctx.json(fixture));
      })
    );
    // Act
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TodoApp />
      </SWRConfig>
    );
    // Assert
    expect(await screen.findByText(/test message/)).toBeInTheDocument();
    expect(todoApiCall).toHaveBeenCalledTimes(1);
  });

  test("APIがエラーを返したら、エラーメッセージが表示されること", async () => {
    // Arrange
    const todoApiCall = jest.fn();
    server.use(
      rest.get("/api/todos", (_req, res, ctx) => {
        todoApiCall();
        return res(
          ctx.status(500),
          ctx.json({
            message: "unreach error",
          })
        );
      })
    );
    // Act
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TodoApp />
      </SWRConfig>
    );
    // Assert
    expect(await screen.findByText(/Request failed/)).toBeInTheDocument();
    expect(todoApiCall).toHaveBeenCalledTimes(1);
  });
});
