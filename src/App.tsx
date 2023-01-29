import useSwr, { useSWRConfig } from "swr";
import "./App.css";

type FetchArgs = Parameters<typeof fetch>;
const fetcher = (...args: FetchArgs) =>
  fetch(...args).then((res) => res.json());

type Todo = {
  id: number;
  text: string;
};

function App() {
  const { mutate } = useSWRConfig();
  const { data, error, isLoading } = useSwr<Todo[]>("/api/todos", fetcher);

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>error: {JSON.stringify(error)}</div>;

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
      <button onClick={() => mutate("/api/todos")}>mutate</button>
    </div>
  );
}

export default App;
