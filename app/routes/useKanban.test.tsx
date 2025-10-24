// app/routes/useKanban.test.tsx
import React from 'react';
import { render, act } from '@testing-library/react';
import { KanbanProvider, useKanban } from './todos';

describe('useKanban', () => {
  function TestComponent() {
    const { draggedId, setDraggedId } = useKanban();
    React.useEffect(() => {
      setDraggedId('test-id');
    }, [setDraggedId]);
    return <span data-testid="dragged-id">{draggedId}</span>;
  }

  it('should provide and update draggedId in context', async () => {
    const { getByTestId } = render(
      <KanbanProvider>
        <TestComponent />
      </KanbanProvider>
    );
    await act(async () => {});
    expect(getByTestId('dragged-id').textContent).toBe('test-id');
  });

  it('should throw error if used outside KanbanProvider', () => {
    // Suppress error output for test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow('useKanban must be used within KanbanProvider');
    spy.mockRestore();
  });
});
