import useSWR, { useSWRConfig } from "swr";
import axios from "axios";
import "./TodoApp.css";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export type Todo = {
  id: number;
  text: string;
};

function TodoApp() {
  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useSWR<Todo[]>("/api/todos", fetcher);

  if (isLoading) return <div>loading...</div>;
  if (error)
    return <div role="alert">error: {JSON.stringify(error.message)}</div>;

  return (
    <div className="App">
      <h1>Todo</h1>
      <ul className="todoList">
        {data?.map((todo) => (
          <li key={todo.id}>
            <div>id: {todo.id}</div>
            <div>text: {todo.text}</div>
          </li>
        ))}
      </ul>
      <button onClick={() => mutate("/api/todos")}>revalidate</button>
    </div>
  );
}

export default TodoApp;
