export const STORAGE_KEY = 'superpowers-todos-v1';

function isValidTodo(todo) {
  return (
    todo &&
    typeof todo.id === 'string' &&
    typeof todo.text === 'string' &&
    typeof todo.completed === 'boolean'
  );
}

export function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidTodo);
  } catch {
    return [];
  }
}

export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (err) {
    console.warn('Failed to save todos:', err);
  }
}
