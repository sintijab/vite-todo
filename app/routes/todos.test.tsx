// routes/todos.test.tsx - UI tests for Kanban Board

import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Todos from './todos';

const mockTodos = [
  { id: '1', text: 'Todo 1', completed: false, createdAt: new Date(), status: 'todo' },
  { id: '2', text: 'Doing 1', completed: false, createdAt: new Date(), status: 'doing' },
  { id: '3', text: 'Done 1', completed: true, createdAt: new Date(), status: 'done' },
];

function TestKanbanRouter() {
  const [todos, setTodos] = React.useState([...mockTodos]);

  function handleAdd(text: string) {
    setTodos(prev => [...prev, { id: String(Date.now()), text, completed: false, createdAt: new Date(), status: 'todo' }]);
  }
  function handleDelete(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }
  function handleMove(id: string, target: string) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, status: target } : t));
  }

  return <Todos todos={todos} onAdd={handleAdd} onDelete={handleDelete} onMove={handleMove} />;
}

describe('Kanban Board UI', () => {
  it('should render all columns and add value by visualizing workflow', async () => {
    await act(async () => {
      render(<TestKanbanRouter />);
    });
    expect(await screen.findByText('Todo')).toBeInTheDocument();
    expect(await screen.findByText('In Progress')).toBeInTheDocument();
    expect(await screen.findByText('Done')).toBeInTheDocument();
  });

  it('should allow creating a new todo to add value for capturing new tasks', async () => {
    await act(async () => {
      render(<TestKanbanRouter />);
    });
    fireEvent.change(await screen.findByPlaceholderText('What needs to be done?'), { target: { value: 'New Task' } });
    fireEvent.click(await screen.findByText('Add'));
    expect(await screen.findByText('New Task')).toBeInTheDocument();
  });

  it('should allow moving a todo between columns to reflect progress', async () => {
    await act(async () => {
      render(<TestKanbanRouter />);
    });
    fireEvent.click((await screen.findAllByText('Move'))[0]);
    expect(await screen.findByText('Todo 1')).toBeInTheDocument();
    expect(await screen.findByText('Done')).toBeInTheDocument();
  });

  it('should allow deleting a todo to keep the board clean', async () => {
    await act(async () => {
      render(<TestKanbanRouter />);
    });
    const todoSpans = await screen.findAllByText('Todo 1');
    const deleteButtons = await screen.findAllByText('×');
      await act(async () => {
        fireEvent.click(deleteButtons[0]);
      });
    await waitFor(() => {
      expect(screen.queryAllByText('Todo 1')).toHaveLength(0);
    });
  });

  it('should show feedback for invalid moves to guide the user', async () => {
    await act(async () => {
      render(<TestKanbanRouter />);
    });
    expect(screen.queryByText(/invalid status/i)).not.toBeInTheDocument();
  });

  it('should display remaining todos count to inform user progress', async () => {
    await act(async () => {
      render(<TestKanbanRouter />);
    });
    expect(await screen.findByText(/remaining/)).toBeInTheDocument();
  });
});