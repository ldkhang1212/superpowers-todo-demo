import { describe, it, expect } from 'vitest';
import { createTodo, toggleTodo, removeTodo } from '../src/todo.js';

describe('createTodo', () => {
  it('returns a new todo with trimmed text', () => {
    const result = createTodo('  Buy milk  ');
    expect(result).toEqual({
      id: expect.any(String),
      text: 'Buy milk',
      completed: false,
    });
  });

  it('returns null for empty or whitespace-only text', () => {
    expect(createTodo('')).toBeNull();
    expect(createTodo('   ')).toBeNull();
  });

  it('generates unique ids', () => {
    const a = createTodo('a');
    const b = createTodo('b');
    expect(a.id).not.toBe(b.id);
  });
});

describe('toggleTodo', () => {
  it('flips completed for matching id', () => {
    const todos = [
      { id: '1', text: 'a', completed: false },
      { id: '2', text: 'b', completed: false },
    ];
    const result = toggleTodo(todos, '1');
    expect(result[0].completed).toBe(true);
    expect(result[1].completed).toBe(false);
  });

  it('returns new array without mutating input', () => {
    const todos = [{ id: '1', text: 'a', completed: false }];
    const result = toggleTodo(todos, '1');
    expect(result).not.toBe(todos);
    expect(todos[0].completed).toBe(false);
  });
});

describe('removeTodo', () => {
  it('removes todo by id', () => {
    const todos = [
      { id: '1', text: 'a', completed: false },
      { id: '2', text: 'b', completed: false },
    ];
    expect(removeTodo(todos, '1')).toEqual([
      { id: '2', text: 'b', completed: false },
    ]);
  });

  it('returns copy when id not found', () => {
    const todos = [{ id: '1', text: 'a', completed: false }];
    const result = removeTodo(todos, 'missing');
    expect(result).toEqual(todos);
    expect(result).not.toBe(todos);
  });
});
