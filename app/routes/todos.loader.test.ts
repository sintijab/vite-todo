import { loader } from './todos';
import * as lib from '../lib/todos.server';

describe('loader', () => {
  it('returns todos from getAllTodos', async () => {
    const mockTodos = [{ id: '1', text: 'Test', completed: false, createdAt: new Date(), status: 'todo' }];
    jest.spyOn(lib, 'getAllTodos').mockReturnValue(mockTodos);
    const result = await loader();
    expect(result).toEqual({ todos: mockTodos });
  });
});
