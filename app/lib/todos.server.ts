export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  status?: string;
}

// In-memory store
let todos: Todo[] = [
  {
    id: "1",
    text: "Learn React Router 7",
    completed: false,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2", 
    text: "Build a todo app",
    completed: true,
    createdAt: new Date("2024-01-02"),
  },
];

let nextId = 3;

export function getAllTodos(): Todo[] {
  return [...todos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function addTodo(text: string): Todo {
  const todo: Todo = {
    id: String(nextId++),
    text,
    completed: false,
    createdAt: new Date(),
  };
  todos.push(todo);
  return todo;
}

export function toggleTodo(id: string): Todo | null {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    return todo;
  }
  return null;
}

export function deleteTodo(id: string): boolean {
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    return true;
  }
  return false;
}

export function moveTodo(id: string, nextStatus: string): Todo | null {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.status = nextStatus;
    if (nextStatus === 'done') {
      todo.completed = true;
    } else if (nextStatus === 'todo') {
      todo.completed = false;
    }
    return todo;
  }
  return null;
}