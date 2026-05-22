import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadTodos, saveTodos, STORAGE_KEY } from '../src/storage.js';

describe('storage', () => {
  const store = {};

  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    vi.stubGlobal('localStorage', {
      getItem: (key) => store[key] ?? null,
      setItem: (key, value) => {
        store[key] = value;
      },
      removeItem: (key) => {
        delete store[key];
      },
    });
    vi.stubGlobal('console', { ...console, warn: vi.fn() });
  });

  it('round-trips todos', () => {
    const todos = [{ id: '1', text: 'hi', completed: false }];
    saveTodos(todos);
    expect(loadTodos()).toEqual(todos);
  });

  it('returns empty array when missing', () => {
    expect(loadTodos()).toEqual([]);
  });

  it('returns empty array on corrupt JSON', () => {
    store[STORAGE_KEY] = 'not-json{{{';
    expect(loadTodos()).toEqual([]);
  });

  it('warns on quota exceeded but does not throw', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new DOMException('QuotaExceededError');
      },
    });
    expect(() => saveTodos([{ id: '1', text: 'x', completed: false }])).not.toThrow();
    expect(console.warn).toHaveBeenCalled();
  });
});
