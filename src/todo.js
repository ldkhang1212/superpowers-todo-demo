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

export function updateTodo(todos, id, newText) {
  const trimmed = newText.trim();
  if (!trimmed) return [...todos];

  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return [...todos];

  return todos.map((todo) =>
    todo.id === id ? { ...todo, text: trimmed } : todo
  );
}

export function filterTodos(todos, query) {
  const trimmed = query.trim();
  if (!trimmed) return [...todos];
  const lower = trimmed.toLowerCase();
  return todos.filter((todo) => todo.text.toLowerCase().includes(lower));
}
