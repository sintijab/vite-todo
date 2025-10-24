import { isValidStatus } from './kanban.schema';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  status?: string;
}


const todos: Todo[] = [
  {
    id: "1",
    text: "Learn React Router 7",
    completed: false,
    createdAt: new Date("2024-01-01"),
    status: 'todo',
  },
  {
    id: "2",
    text: "Build a todo app",
    completed: true,
    createdAt: new Date("2024-01-02"),
    status: 'done',
  },
];

// In-memory store for todos (use Map for efficient lookup)
const todosMap = new Map<string, Todo>(todos.map(todo => [todo.id, todo]));
let nextId = todos.length + 1;

export function getAllTodos(): Todo[] {
  return Array.from(todosMap.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function addTodo(text: string): Todo {
  const todo: Todo = {
    id: String(nextId++),
    text,
    completed: false,
    createdAt: new Date(),
    status: 'todo',
  };
  todosMap.set(todo.id, todo);
  return todo;
}

export function toggleTodo(id: string): Todo | null {
  const todo = todosMap.get(id);
  if (todo) {
    todo.completed = !todo.completed;
    return todo;
  }
  return null;
}

export function deleteTodo(id: string): boolean {
  return todosMap.delete(id);
}

export function moveTodo(id: string, nextStatus: string): Todo | null {
  const todo = todosMap.get(id);
  if (todo && isValidStatus(nextStatus)) {
    todo.status = nextStatus;
    todo.completed = nextStatus === 'done';
    return todo;
  }
  return null;
}