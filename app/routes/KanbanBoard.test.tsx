import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Todos from './todos';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import type { Todo } from '../lib/todos.server';
import { fireEvent } from '@testing-library/react';
import { act } from 'react';

const todos: Todo[] = [
    { id: '1', text: 'Todo 1', completed: false, createdAt: new Date(), status: 'todo' },
    { id: '2', text: 'Doing 1', completed: false, createdAt: new Date(), status: 'doing' },
    { id: '3', text: 'Done 1', completed: true, createdAt: new Date(), status: 'done' },
];

describe('KanbanBoard (fallback test mode)', () => {
    it('renders all columns and todos', () => {
        const router = createMemoryRouter([
            {
                path: '/',
                element: <Todos todos={todos} />,
            },
        ]);
        render(<RouterProvider router={router} />);
        expect(screen.getByText('Todo')).toBeInTheDocument();
        expect(screen.getByText('In Progress')).toBeInTheDocument();
        expect(screen.getByText('Done')).toBeInTheDocument();
        expect(screen.getByText('Todo 1')).toBeInTheDocument();
        expect(screen.getByText('Doing 1')).toBeInTheDocument();
        expect(screen.getByText('Done 1')).toBeInTheDocument();
    });

    it('shows empty message if no todos', () => {
        const router = createMemoryRouter([
            {
                path: '/',
                element: <Todos todos={[]} />,
            },
        ]);
        render(<RouterProvider router={router} />);
        expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();
        expect(screen.queryByText('No todos yet!')).not.toBeNull();
    });

    it('handleDragEnd clears draggedId', () => {
        const router = createMemoryRouter([
            {
                path: '/',
                element: <Todos todos={todos} />,
            },
        ]);
        render(<RouterProvider router={router} />);
        // Simulate drag start with mocked dataTransfer
        const card = screen.getByText('Todo 1').closest('div[data-todo-id]');
        expect(card).toBeInTheDocument();
        const dragStartEvent = new window.Event('dragstart', { bubbles: true });
        // @ts-ignore
        dragStartEvent.dataTransfer = {
            setData: jest.fn(),
            getData: jest.fn(),
        };
        act(() => {
            card!.dispatchEvent(dragStartEvent);
        });
        act(() => {
            fireEvent.dragEnd(card!);
        });
        // There is no direct UI for draggedId, but this ensures no error and event is handled
        // Optionally, you could spy on setDraggedId if refactored for testability
    });

    it('uses routerData.todos when propTodos is not provided', async () => {
        // Simulate router context with loader data
        const routerTodos = [
            { id: '10', text: 'Router Todo', completed: false, createdAt: new Date(), status: 'todo' },
        ];
        const router = createMemoryRouter([
            {
                id: 'root',
                path: '/',
                loader: async () => ({ todos: routerTodos }),
                element: <Todos />, // no propTodos
            },
        ]);
        render(<RouterProvider router={router} />);
        expect(await screen.findByText('Router Todo')).toBeInTheDocument();
    });
});
