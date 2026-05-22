# Todo Demo — Design Spec

**Date:** 2026-05-22  
**Status:** Approved  
**Purpose:** Small vanilla web todo app to practice the full Superpowers workflow (brainstorm → plan → TDD → verify).

## Summary

A polished, accessible todo list in plain HTML/CSS/JS with `localStorage` persistence. Modular file layout (no bundler) with Vitest unit tests on pure JS modules. Primary accent: **pink Add button**.

## Approach

**B — Modular classic** (selected in brainstorming)

- No framework, no bundler for the app itself
- Vitest for tests only
- Open `index.html` directly in a browser (optional `npx serve .`)

## File Structure

```
test_superpowers/
├── index.html
├── styles.css
├── src/
│   ├── todo.js       # Pure todo logic
│   ├── storage.js    # localStorage load/save
│   └── app.js        # DOM + event wiring
├── tests/
│   ├── todo.test.js
│   └── storage.test.js
├── package.json
└── docs/superpowers/specs/2026-05-22-todo-demo-design.md
```

## Features

| Feature | Behavior |
|---------|----------|
| Add | Trim input; reject empty; new todo `{ id, text, completed: false }` |
| Complete | Checkbox toggles `completed` |
| Delete | Remove todo by `id` |
| Persist | Save full array to `localStorage` on every mutation |
| Empty state | Show message when list is empty; hide when todos exist |

**Out of scope:** edit text, filters, drag-reorder, due dates, backend.

## Data Model

```json
[
  { "id": "<string>", "text": "<string>", "completed": false }
]
```

- **Storage key:** `superpowers-todos-v1`
- **IDs:** `crypto.randomUUID()` when available; fallback to incrementing string
- **Corrupt/missing data:** treat as `[]`

## UI / Visual Design

- **Layout:** Centered card / app shell (see brainstorm mockup `design-mockup-v2.html`)
- **Theme:** `prefers-color-scheme` for light and dark; CSS custom properties for colors
- **Add button:** Pink accent
  - Default: `#ec4899` background, white text
  - Hover: `#db2777`
  - Focus: visible `:focus-visible` ring using pink
- **Completed todos:** strikethrough + reduced opacity
- **Delete:** text-style control, destructive color (red), `aria-label="Delete"`
- **Empty state:** centered helper text — “No todos yet — add one above”

## Module Responsibilities

### `todo.js` (pure, testable)

- `createTodo(text, existingTodos)` → new todo or null if empty
- `toggleTodo(todos, id)` → updated array
- `removeTodo(todos, id)` → updated array

### `storage.js`

- `loadTodos()` → array (handles parse errors → `[]`)
- `saveTodos(todos)` → void (catch quota errors, `console.warn`)

### `app.js`

- Load todos on init, render list, bind form/checkbox/delete
- Call `saveTodos` after every state change
- Toggle empty-state visibility

## Accessibility

- Semantic structure: `<main>`, `<form>`, `<ul>`, `<li>`
- Input has associated label (visible or `aria-label`)
- Delete buttons: `aria-label="Delete"`
- Keyboard: Tab order add → checkboxes → deletes; Enter submits form
- Focus styles on all interactive elements

## Error Handling

| Case | Behavior |
|------|----------|
| Empty add | No-op |
| Invalid JSON in storage | Reset to `[]` |
| `localStorage` quota exceeded | `console.warn`; keep in-memory state for session |

## Testing Strategy (TDD)

- **Runner:** Vitest
- **DOM:** happy-dom or jsdom for any future app tests; v1 focuses on unit tests
- **`todo.test.js`:** create (valid/empty), toggle, remove
- **`storage.test.js`:** round-trip with mocked `localStorage`, corrupt JSON → `[]`

`app.js` stays thin; no mandatory DOM integration tests in v1.

## Running

```bash
npm test
# Open index.html in browser, or:
npx serve .
```

## Brainstorm Artifacts

- Approach comparison: `.superpowers/brainstorm/win-1779443398.94067/content/approaches.html`
- UI mockup (pink Add): `.superpowers/brainstorm/win-1779443398.94067/content/design-mockup-v2.html`
