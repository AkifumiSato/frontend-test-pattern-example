import React from "react";
import ReactDOM from "react-dom/client";
import TodoApp from "./TodoApp";
import { worker } from "./mocks/browser";
import "./index.css";

// always msw enabled!!!
worker.start();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TodoApp />
  </React.StrictMode>
);
