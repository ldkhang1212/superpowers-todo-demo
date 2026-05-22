import { createTodo, toggleTodo, removeTodo } from './todo.js';
import { loadTodos, saveTodos } from './storage.js';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');

let todos = loadTodos();

function persist() {
  saveTodos(todos);
  render();
}

function render() {
  list.innerHTML = '';

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;
    li.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute(
      'aria-label',
      todo.completed ? 'Mark incomplete' : 'Mark complete'
    );

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', 'Delete');

    checkbox.addEventListener('change', () => {
      todos = toggleTodo(todos, todo.id);
      persist();
    });

    deleteBtn.addEventListener('click', () => {
      todos = removeTodo(todos, todo.id);
      persist();
    });

    li.append(checkbox, span, deleteBtn);
    list.appendChild(li);
  });

  emptyState.hidden = todos.length > 0;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTodo = createTodo(input.value);
  if (!newTodo) return;
  todos = [...todos, newTodo];
  input.value = '';
  persist();
});

render();
