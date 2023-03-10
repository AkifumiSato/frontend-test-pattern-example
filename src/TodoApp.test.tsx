import { render, screen } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import userEvent from "@testing-library/user-event";
import * as stories from "./TodoApp.stories";
import { SWRConfig } from "swr";
import { rest } from "msw";
import { setupServer } from "msw/node";
import React from "react";

const server = setupServer();
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const { ApiSuccess, ApiError } = composeStories(stories);
const user = userEvent.setup();

type RestGetCallback = Parameters<typeof rest.get>[1];
const setupTodoApi = (callback: RestGetCallback) => {
  const apiRequestCall = jest.fn(callback);
  server.use(
    rest.get("/api/todos", (req, res, ctx) => {
      return apiRequestCall(req, res, ctx);
    })
  );
  return {
    apiRequestCall,
  };
};
const renderWithNoCache = (ui: React.ReactNode) =>
  render(<SWRConfig value={{ provider: () => new Map() }}>{ui}</SWRConfig>);

describe("API呼び出し成功時", () => {
  test("取得結果が表示されること", async () => {
    // Arrange
    const { apiRequestCall } = setupTodoApi((_req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json([
          {
            id: 0,
            text: "test message",
          },
        ])
      )
    );
    // Act
    renderWithNoCache(<ApiSuccess />);
    // Assert
    expect(await screen.findByText(/test message/)).toBeInTheDocument();
    expect(apiRequestCall).toHaveBeenCalledTimes(1);
  });

  test("revalidateボタン押下で再度APIが呼び出されること", async () => {
    // Arrange
    const { apiRequestCall } = setupTodoApi((_req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json([
          {
            id: 0,
            text: "test message",
          },
        ])
      )
    );
    const renderResult = renderWithNoCache(<ApiSuccess />);
    const revalidateButton = await renderResult.findByRole("button", {
      name: "revalidate",
    });
    // Act
    await user.click(revalidateButton);
    // Assert
    expect(apiRequestCall).toHaveBeenCalledTimes(2);
  });
});

describe("API呼び出しエラー時", () => {
  test("エラーメッセージが表示されること", async () => {
    // Arrange
    const { apiRequestCall } = setupTodoApi((_req, res, ctx) =>
      res(
        ctx.status(500),
        ctx.json({
          message: "unreach error",
        })
      )
    );
    // Act
    renderWithNoCache(<ApiError />);
    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /Request failed/
    );
    expect(apiRequestCall).toHaveBeenCalledTimes(1);
  });
});
