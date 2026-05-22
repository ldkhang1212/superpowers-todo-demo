# Edit Todo — Design Spec

**Date:** 2026-05-22  
**Status:** Approved  
**Parent project:** Superpowers Todo Demo  
**Purpose:** Allow users to edit existing todo text via an accessible modal dialog.

## Summary

Add per-row **Edit** buttons that open a native `<dialog>` to change todo text. Empty saves are rejected (original text preserved). Logic lives in pure `updateTodo()` with Vitest coverage; DOM wiring in `app.js`.

## Requirements (from brainstorming)

| Decision | Choice |
|----------|--------|
| Feature | Edit todo text |
| UI pattern | Modal/dialog |
| Trigger | Edit button per row |
| Empty save | Reject — keep original text |
| Approach | B — `updateTodo` in `todo.js`, modal in HTML/CSS/`app.js` |

## Behavior

| Action | Result |
|--------|--------|
| Click **Edit** | Open modal with current todo text; focus input; store active todo `id` |
| **Save** (button or Enter) | Trim input; if empty → close modal, no data change; else `updateTodo`, persist, re-render |
| **Cancel** | Close modal, no change |
| **Escape** | Close modal, no change |
| Backdrop click | Close modal, no change (cancel semantics) |

On close, return focus to the Edit button that opened the dialog.

## UI

- Native `<dialog id="edit-dialog">` with `::backdrop`
- Heading: “Edit todo”
- Single text `<input>` (prefilled)
- **Save** — pink primary (`--accent`), matches Add button
- **Cancel** — secondary/neutral style
- Light/dark via existing CSS variables
- Modal centered; max-width ~400px; padding consistent with app card

## Accessibility

- `<dialog>` provides focus trap when using `showModal()`
- `aria-labelledby` on dialog pointing to heading
- Edit button: `aria-label="Edit"` (or “Edit {text}” truncated)
- Save/Cancel are explicit `<button type="button">`; Save on form submit or Enter
- Focus restoration to triggering Edit button after close

## Module changes

### `src/todo.js`

```javascript
updateTodo(todos, id, newText) → todos[]
```

- Trim `newText`
- If trimmed empty → return same array reference or shallow copy with no changes (no mutation)
- If `id` not found → return unchanged copy
- Else map matching todo: `{ ...todo, text: trimmed }`
- Do not mutate input array

### `src/app.js`

- Add Edit button per row (before or after Delete)
- Wire `openEditDialog(id)`, `closeEditDialog()`, `saveEdit()`
- Track `editingId` while modal open
- Call `updateTodo` + `saveTodos` on valid save

### `index.html`

- `<dialog id="edit-dialog">` with form, label, input, Save, Cancel

### `styles.css`

- `.edit-dialog`, backdrop, button row, input focus states

## Data model

No schema change:

```json
{ "id": "<string>", "text": "<string>", "completed": false }
```

## Testing (TDD)

**`tests/todo.test.js`** — add cases for `updateTodo`:

- Updates text with trim
- Empty/whitespace-only → no change to todos
- Unknown id → unchanged
- Does not mutate input array

No required DOM tests in v1 (consistent with existing app).

## Error handling

| Case | Behavior |
|------|----------|
| Empty save | Reject, close modal |
| Missing dialog elements | Fail fast at init (dev-only concern) |
| Corrupt storage | Existing `loadTodos` validation unchanged |

## Out of scope

- Inline edit, click-to-edit text
- Edit completed state from modal
- Undo, edit history, bulk edit
- Filters, tags, due dates

## Files touched

| File | Action |
|------|--------|
| `src/todo.js` | Add `updateTodo` |
| `tests/todo.test.js` | Add tests |
| `index.html` | Add dialog markup |
| `styles.css` | Dialog styles |
| `src/app.js` | Edit button + modal wiring |

## Running / verification

```bash
npm test
npm run serve
```

Manual checks:

1. Edit todo → change text → Save → list updates, persists on refresh
2. Clear text → Save → original text unchanged
3. Cancel / Escape / backdrop → no change
4. Keyboard: Tab through modal, Enter saves, Escape closes
