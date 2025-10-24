import { Form, useSubmit } from "react-router";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Route } from "./+types/todos";
import { getAllTodos, addTodo, toggleTodo, deleteTodo, moveTodo } from "../lib/todos.server";
import { COLUMNS, type KanbanStatus } from "../lib/kanban.schema";
import type { Todo } from "../lib/todos.server";

export async function loader() {
  return { todos: getAllTodos() };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "add": {
      const text = formData.get("text");
      if (typeof text === "string" && text.trim()) {
        addTodo(text.trim());
      }
      break;
    }
    case "toggle": {
      const id = formData.get("id");
      if (typeof id === "string") {
        toggleTodo(id);
      }
      break;
    }
    case "delete": {
      const id = formData.get("id");
      if (typeof id === "string") {
        deleteTodo(id);
      }
      break;
    }
    case "move": {
      const id = formData.get("id") as any;
      const target = formData.get("target") as unknown as string;
      if (typeof id === "string" && typeof target === "string") {
        moveTodo(id, target as any);
      }
      break;
    }
    default: {
      return { ok: true };
    }
  }

  return { success: true };
}

export function meta() {
  return [
    { title: "Todos" },
    { name: "description", content: "A simple todo app" },
  ];
}

interface KanbanContextType {
  draggedId: string | null;
  setDraggedId: (id: string | null) => void;
}

const KanbanContext = createContext<KanbanContextType | null>(null);

function KanbanProvider({ children }: { children: ReactNode }) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  return (
    <KanbanContext.Provider value={{ draggedId, setDraggedId }}>
      {children}
    </KanbanContext.Provider>
  );
}

function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) throw new Error("useKanban must be used within KanbanProvider");
  return context;
}

function FormBridge() {
  const submit = useSubmit();
  return {
    submit: (data: Record<string, any>) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      submit(formData, { method: "post" });
    }
  };
}

function KanbanCard({ todo }: { todo: Todo }) {
  const { setDraggedId } = useKanban();
  const formBridge = FormBridge();

  const handleDragStart = (e: React.DragEvent) => {
    setDraggedId(todo.id);
    e.dataTransfer.setData('text/plain', todo.id);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="p-3 border border-gray-200 rounded-md bg-white shadow-sm mb-2 cursor-move"
      style={{ minHeight: '80px' }}
      data-todo-id={todo.id}
    >
      <div className="flex items-start justify-between">
        <span className="text-gray-800 text-sm flex-1">{todo.text}</span>
        <div className="flex gap-1 ml-2">
          <button
            onClick={() => formBridge.submit({ intent: 'move', id: todo.id, target: 'done' })}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
          >
            Move
          </button>
          <Form method="post" style={{ display: "contents" }}>
            <input type="hidden" name="intent" value="delete" />
            <input type="hidden" name="id" value={todo.id} />
            <button
              type="submit"
              className="text-red-500 hover:text-red-700 font-bold text-sm"
            >
              ×
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({ 
  status, 
  todos, 
  title 
}: { 
  status: KanbanStatus; 
  todos: Todo[]; 
  title: string; 
}) {
  const formBridge = FormBridge();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    formBridge.submit({ intent: 'move', id, target: status });
  };

  return (
    <div
      className="flex-1 p-4 bg-gray-100 rounded-lg"
      style={{ minHeight: '400px' }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h3 className="font-semibold text-gray-700 mb-3 text-center">{title}</h3>
      <div className="space-y-2">
        {todos.map((todo) => (
          <KanbanCard key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}

function KanbanBoard({ todos }: { todos: Todo[] }) {
  const todosByStatus = useMemo(() => {
    const todoList = todos.filter(t => !t.status || t.status === 'todo' || (!t.completed && !t.status));
    const doingList = todos.filter(t => t.status === 'doing');
    const doneList = todos.filter(t => t.status === 'done' || t.completed);
    
    return { todo: todoList, doing: doingList, done: doneList };
  }, [todos]);

  return (
    <div className="grid grid-cols-3 gap-4" style={{ padding: '16px' }}>
      <KanbanColumn 
        status="todo" 
        todos={todosByStatus.todo} 
        title={COLUMNS.todo.label} 
      />
      <KanbanColumn 
        status="doing" 
        todos={todosByStatus.doing} 
        title={COLUMNS.doing.label} 
      />
      <KanbanColumn 
        status="done" 
        todos={todosByStatus.done} 
        title={COLUMNS.done.label} 
      />
    </div>
  );
}

export default function Todos({ loaderData }: Route.ComponentProps) {
  const { todos } = loaderData;

  return (
    <KanbanProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Kanban Board</h1>
          </div>
          
          {/* Add todo form */}
          <Form method="post" className="mb-6">
            <input type="hidden" name="intent" value="add" />
            <div className="flex gap-2">
              <input
                type="text"
                name="text"
                placeholder="What needs to be done?"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
          </Form>

          {/* Kanban Board */}
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No todos yet!</p>
          ) : (
            <KanbanBoard todos={todos} />
          )}

          {todos.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 text-center">
              {todos.filter(t => !t.completed).length} of {todos.length} remaining
            </div>
          )}
        </div>
      </div>
    </KanbanProvider>
  );
}