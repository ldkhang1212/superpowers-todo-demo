# Todo Search Filter — Design Spec

**Date:** 2026-05-22  
**Status:** Approved  
**Parent project:** Superpowers Todo Demo  
**Purpose:** Filter visible todos by substring search (case-insensitive) without changing stored data.

## Summary

Add a search input below the add form. As the user types, the list shows only todos whose `text` contains the query (case-insensitive). Empty search shows all todos. No persistence of query on refresh.

## Requirements (from brainstorming)

| Decision | Choice |
|----------|--------|
| Filter type | Text search |
| Match | Substring, case-sensitive |
| Persist query | No — reset on reload |
| No matches | Message: “No todos match your search” |
| Approach | B — `filterTodos` in `todo.js` + Vitest |

## Behavior

| State | List | Empty message |
|-------|------|----------------|
| `todos.length === 0` | Empty | “No todos yet — add one above” |
| Search empty | All todos | Hidden if todos exist |
| Search + matches | Filtered subset | Hidden |
| Search + no matches | Empty | “No todos match your search” |

- Filter on every `input` event (no debounce)
- **Display-only:** `todos` array and `localStorage` always hold full list
- Add, edit, delete, toggle operate on full list; `render()` applies filter for display

## UI

- Placement: between add form and `<ul id="todo-list">`
- `<input type="search" id="todo-search" placeholder="Search todos…">`
- Accessible label (`visually-hidden` or `aria-label="Search todos"`)
- Styles match existing inputs; `:focus-visible` pink ring
- Optional: `autocomplete="off"`

## Module changes

### `src/todo.js`

```javascript
filterTodos(todos, query) → todos[]
```

- Trim `query`
- If trimmed empty → return all todos (shallow copy `[...todos]` or filter passthrough)
- Else return todos where `todo.text.includes(trimmed)` (case-sensitive)
- Do not mutate input array

### `src/app.js`

- `let searchQuery = ''`
- Listen `input` on `#todo-search` → update `searchQuery`, call `render()` (not `persist()`)
- `render()`: `const visible = filterTodos(todos, searchQuery)` — render `visible`
- Update empty-state visibility per table above
- Add second empty-state element OR reuse one element with dynamic text (design: **two elements** for clarity)

### `index.html`

- Search input + label
- New `<p id="search-empty-state" hidden>No todos match your search</p>`

### `styles.css`

- `.todo-search` block styles

## Data model

Unchanged. No `localStorage` key for search query.

## Testing (TDD)

**`tests/todo.test.js`** — `filterTodos`:

- Empty/whitespace query returns all todos
- Substring match (case-insensitive)
- No match returns `[]`
- Does not mutate input
- Trim query before matching

## Accessibility

- Search input labeled
- `aria-live="polite"` on list already present — filtered updates announced
- Empty search message visible only when relevant

## Out of scope

- All/Active/Completed tabs
- Persist search in `localStorage`
- Regex / fuzzy search
- Highlight matched text
- Debouncing

## Files touched

| File | Action |
|------|--------|
| `src/todo.js` | Add `filterTodos` |
| `tests/todo.test.js` | Add tests |
| `index.html` | Search input + search empty state |
| `styles.css` | Search input styles |
| `src/app.js` | Wire search + dual empty states |

## Verification

```bash
npm test
npm run serve
```

Manual: add todos, search narrows list, clear search restores, no-match message, refresh clears search.
