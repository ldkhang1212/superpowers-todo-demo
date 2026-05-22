import { describe, it, expect } from 'vitest';
import { createTodo, toggleTodo, removeTodo, updateTodo, filterTodos } from '../src/todo.js';

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

describe('updateTodo', () => {
  const todos = [
    { id: '1', text: 'Buy milk', completed: false },
    { id: '2', text: 'Walk dog', completed: true },
  ];

  it('updates text with trim', () => {
    const result = updateTodo(todos, '1', '  Buy oat milk  ');
    expect(result[0].text).toBe('Buy oat milk');
    expect(result[1]).toEqual(todos[1]);
  });

  it('returns unchanged todos for empty or whitespace text', () => {
    expect(updateTodo(todos, '1', '')).toEqual(todos);
    expect(updateTodo(todos, '1', '   ')).toEqual(todos);
  });

  it('returns unchanged todos when id not found', () => {
    const result = updateTodo(todos, 'missing', 'New text');
    expect(result).toEqual(todos);
    expect(result).not.toBe(todos);
  });

  it('does not mutate input array', () => {
    const copy = [...todos];
    updateTodo(todos, '1', 'Changed');
    expect(todos).toEqual(copy);
  });
});

describe('filterTodos', () => {
  const todos = [
    { id: '1', text: 'Buy milk', completed: false },
    { id: '2', text: 'Walk dog', completed: true },
    { id: '3', text: 'Read book', completed: false },
  ];

  it('returns all todos when query is empty or whitespace', () => {
    expect(filterTodos(todos, '')).toEqual(todos);
    expect(filterTodos(todos, '   ')).toEqual(todos);
  });

  it('matches substring case-sensitively', () => {
    expect(filterTodos(todos, 'milk')).toEqual([todos[0]]);
    expect(filterTodos(todos, 'MIL')).toEqual([]);
    expect(filterTodos(todos, 'o')).toHaveLength(2);
  });

  it('trims query before matching', () => {
    expect(filterTodos(todos, '  milk  ')).toEqual([todos[0]]);
  });

  it('returns empty array when nothing matches', () => {
    expect(filterTodos(todos, 'xyz')).toEqual([]);
  });

  it('does not mutate input array', () => {
    const copy = [...todos];
    filterTodos(todos, 'milk');
    expect(todos).toEqual(copy);
  });
});
