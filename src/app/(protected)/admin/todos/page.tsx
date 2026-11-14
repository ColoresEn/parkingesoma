import { Suspense } from "react";
import { getUserTodoListAction } from "@/actions/todo.actions";
import AddTodoForm from "@/components/todos/AddTodoForm";
import TodosTable from "@/components/todos/TodoTable";
import getCurrentUser from "@/actions/getCurrentUser";

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="container" role="status">
          Loading todos...
        </main>
      }
    >
      <TodosPage />
    </Suspense>
  );
}

async function TodosPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  const userId = currentUser?.id;
  const todos = await getUserTodoListAction({ userId });

  return (
    <main className="container">
      <div className="mx-auto flex w-full lg:w-3/4 flex-col justify-center space-y-4 mt-10">
        <AddTodoForm userId={userId} />
        <TodosTable todos={todos} />
      </div>
    </main>
  );
}
