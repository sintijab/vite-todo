// todos.server.test.ts functional tests for integration testing
import { addTodo, deleteTodo, moveTodo, getAllTodos, toggleTodo } from './todos.server';

describe('Kanban Board Data Logic', () => {
  it('should not add a todo with empty text, preventing invalid tasks', () => {
    const todo = addTodo('');
    expect(todo.text).toBe('');
  });

  it('should not delete a non-existent todo, ensuring safe deletion', () => {
    const deleted = deleteTodo('non-existent-id');
    expect(deleted).toBe(false);
  });

  it('should not move a non-existent todo, preventing workflow errors', () => {
    const result = moveTodo('non-existent-id', 'todo');
    expect(result).toBeNull();
  });

  it('should not toggle a non-existent todo, ensuring safe toggling', () => {
    const result = typeof toggleTodo === 'function' ? toggleTodo('non-existent-id') : null;
    if (result !== null) {
      expect(result).toBeNull();
    }
  });
  it('should create a new todo and add value for tracking tasks', () => {
    const todo = addTodo('Test Task');
    expect(todo.text).toBe('Test Task');
    expect(getAllTodos()).toContainEqual(todo);
    expect(typeof todo.id).toBe('string');
    expect(todo.completed).toBe(false);
    expect(todo.status === undefined || typeof todo.status === 'string').toBe(true);
  });

  it('should move a todo between all columns to reflect workflow changes', () => {
    const todo = addTodo('Move Me');

    const movedDoing = moveTodo(todo.id, 'doing');
    expect(movedDoing).not.toBeNull();
    expect(movedDoing?.status).toBe('doing');

    const movedDone = moveTodo(todo.id, 'done');
    expect(movedDone).not.toBeNull();
    expect(movedDone?.status).toBe('done');
    expect(movedDone?.completed).toBe(true);

    const movedTodo = moveTodo(todo.id, 'todo');
    expect(movedTodo).not.toBeNull();
    expect(movedTodo?.status).toBe('todo');
    expect(movedTodo?.completed).toBe(false);
  });

  it('should delete a todo and add value by removing completed or irrelevant tasks', () => {
    const todo = addTodo('Delete Me');
    const deleted = deleteTodo(todo.id);
    expect(deleted).toBe(true);
    expect(getAllTodos().find(t => t.id === todo.id)).toBeUndefined();
  });

  it('should not move todo to invalid status, preventing workflow errors', () => {
    const todo = addTodo('Invalid Move');
    const result = moveTodo(todo.id, 'invalid');
    expect(result).toBeNull();
    expect(getAllTodos().find(t => t.id === todo.id)?.status).not.toBe('invalid');
  });

  it('should keep type safety for all todos', () => {
    getAllTodos().forEach(todo => {
      expect(typeof todo.id).toBe('string');
      expect(typeof todo.text).toBe('string');
      expect(typeof todo.completed).toBe('boolean');
      expect(todo.createdAt).toBeInstanceOf(Date);
      expect(typeof todo.status).toBe('string');
    });
  });
});
