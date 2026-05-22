# Todo Search Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add live substring search to filter visible todos without changing stored data.

**Architecture:** Pure `filterTodos(todos, query)` in `todo.js` with Vitest. `app.js` tracks `searchQuery`, filters at render time, separate empty states for no todos vs no search matches.

**Tech Stack:** Vanilla ES modules, Vitest

**Spec:** `docs/superpowers/specs/2026-05-22-todo-search-filter-design.md`

---

### Task 1: `filterTodos` (TDD)

**Files:**
- Modify: `tests/todo.test.js`
- Modify: `src/todo.js`

- [ ] **Step 1: Add failing tests**

Update import:

```javascript
import { createTodo, toggleTodo, removeTodo, updateTodo, filterTodos } from '../src/todo.js';
```

Append:

```javascript
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

  it('matches substring case-insensitively', () => {
    expect(filterTodos(todos, 'MIL')).toEqual([todos[0]]);
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
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `npm test`

- [ ] **Step 3: Implement in `src/todo.js`**

```javascript
export function filterTodos(todos, query) {
  const trimmed = query.trim();
  if (!trimmed) return [...todos];
  const lower = trimmed.toLowerCase();
  return todos.filter((todo) => todo.text.toLowerCase().includes(lower));
}
```

- [ ] **Step 4: Run tests — expect PASS (22 total)**

Run: `npm test`

- [ ] **Step 5: Commit**

```bash
git add src/todo.js tests/todo.test.js
git commit -m "feat: add filterTodos with tests"
```

---

### Task 2: Search UI markup

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add search input after `</form>` (before `<ul>`)**

```html
      <label for="todo-search" class="visually-hidden">Search todos</label>
      <input
        id="todo-search"
        class="todo-search"
        type="search"
        placeholder="Search todos…"
        autocomplete="off"
        aria-label="Search todos"
      />
```

- [ ] **Step 2: Add search empty state after list empty state**

```html
      <p id="search-empty-state" class="empty-state" hidden>
        No todos match your search
      </p>
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add search filter markup"
```

---

### Task 3: Search styles

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Add after `.todo-form` block**

```css
.todo-search {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  font-size: 1rem;
  margin-bottom: 1rem;
}

.todo-search:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

- [ ] **Step 2: Commit**

```bash
git add styles.css
git commit -m "feat: style todo search input"
```

---

### Task 4: Wire search in `app.js`

**Files:**
- Modify: `src/app.js`

- [ ] **Step 1: Add imports and refs**

```javascript
import { createTodo, toggleTodo, removeTodo, updateTodo, filterTodos } from './todo.js';
```

```javascript
const searchInput = document.getElementById('todo-search');
const searchEmptyState = document.getElementById('search-empty-state');
let searchQuery = '';
```

- [ ] **Step 2: Update `render()`**

At start of `render()`:

```javascript
  const visible = filterTodos(todos, searchQuery);
```

Change `todos.forEach` to `visible.forEach`.

Replace empty-state block at end:

```javascript
  const hasSearch = searchQuery.trim().length > 0;
  emptyState.hidden = todos.length > 0;
  searchEmptyState.hidden = !(hasSearch && todos.length > 0 && visible.length === 0);
```

- [ ] **Step 3: Add search listener before `render()`**

```javascript
searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value;
  render();
});
```

- [ ] **Step 4: Run tests + manual check**

Run: `npm test`  
Run: `npm run serve` — verify search, no-match message, refresh clears search

- [ ] **Step 5: Commit**

```bash
git add src/app.js
git commit -m "feat: wire live todo search filter"
```

---

### Task 5: Docs and verification

- [ ] **Step 1: `npm test` — all pass**

- [ ] **Step 2: Commit docs**

```bash
git add docs/superpowers/specs/2026-05-22-todo-search-filter-design.md docs/superpowers/plans/2026-05-22-todo-search-filter.md
git commit -m "docs: add search filter spec and plan"
```
