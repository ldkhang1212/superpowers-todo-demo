import {
  createTodo,
  toggleTodo,
  removeTodo,
  updateTodo,
  filterTodos,
} from './todo.js';
import { loadTodos, saveTodos } from './storage.js';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('todo-search');
const searchEmptyState = document.getElementById('search-empty-state');
let searchQuery = '';
const editDialog = document.getElementById('edit-dialog');
const editForm = document.getElementById('edit-form');
const editInput = document.getElementById('edit-input');
const editCancel = document.getElementById('edit-cancel');

let todos = loadTodos();
let editingId = null;
let triggerEditButton = null;

function persist() {
  saveTodos(todos);
  render();
}

function closeEditDialog() {
  if (!editDialog.open) return;
  editDialog.close();
  editingId = null;
  if (triggerEditButton) {
    triggerEditButton.focus();
    triggerEditButton = null;
  }
}

function openEditDialog(id, editButton) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  editingId = id;
  triggerEditButton = editButton;
  editInput.value = todo.text;
  editDialog.showModal();
  editInput.focus();
  editInput.select();
}

function saveEdit() {
  if (!editingId) {
    closeEditDialog();
    return;
  }

  const before = JSON.stringify(todos);
  todos = updateTodo(todos, editingId, editInput.value);
  closeEditDialog();

  if (JSON.stringify(todos) !== before) {
    persist();
  }
}

function render() {
  const visible = filterTodos(todos, searchQuery);
  list.innerHTML = '';

  visible.forEach((todo) => {
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

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn-edit';
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('aria-label', `Edit ${todo.text}`);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', 'Delete');

    checkbox.addEventListener('change', () => {
      todos = toggleTodo(todos, todo.id);
      persist();
    });

    editBtn.addEventListener('click', () => {
      openEditDialog(todo.id, editBtn);
    });

    deleteBtn.addEventListener('click', () => {
      todos = removeTodo(todos, todo.id);
      persist();
    });

    li.append(checkbox, span, editBtn, deleteBtn);
    list.appendChild(li);
  });

  const hasSearch = searchQuery.trim().length > 0;
  emptyState.hidden = todos.length > 0;
  searchEmptyState.hidden = !(hasSearch && todos.length > 0 && visible.length === 0);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTodo = createTodo(input.value);
  if (!newTodo) return;
  todos = [...todos, newTodo];
  input.value = '';
  persist();
});

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  saveEdit();
});

editCancel.addEventListener('click', () => {
  closeEditDialog();
});

editDialog.addEventListener('cancel', (e) => {
  e.preventDefault();
  closeEditDialog();
});

editDialog.addEventListener('close', () => {
  editingId = null;
  triggerEditButton = null;
});

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value;
  render();
});

render();
