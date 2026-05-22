export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `todo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  return {
    id: generateId(),
    text: trimmed,
    completed: false,
  };
}

export function toggleTodo(todos, id) {
  return todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
}

export function removeTodo(todos, id) {
  const filtered = todos.filter((todo) => todo.id !== id);
  return filtered.length === todos.length ? [...todos] : filtered;
}
