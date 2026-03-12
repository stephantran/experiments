# Nested Lists — Territory Tags for Webflow CMS

> Bypasses Webflow's 5-item nested collection list limit by using a plain text field + lightweight script to render territory/state tags per rep.

## The Problem

Webflow CMS multi-reference fields are limited to **5 items** when used inside a nested collection list. If a REP covers 25–30 states/territories, you can only display 5 natively.

## The Solution

Instead of relying on Webflow's nested collection list, we:

1. Store territories as a **plain text field** on the REPS collection
2. A small script parses the text and renders styled tags at runtime
3. Territories with regional qualifiers (e.g., "Washington (Western)") are automatically **grouped by state**

### Before (native Webflow — capped at 5)

```
Washington (Western) | Washington (Eastern) | Idaho (Northern) | Oregon | Washington
```

### After (grouped tags — no limit)

```
┌────────────────────────────────────┐  ┌──────────────────┐  ┌────────┐
│ Washington  Western · Eastern · SW │  │ Idaho   Northern  │  │ Oregon │
└────────────────────────────────────┘  └──────────────────┘  └────────┘
```

## Webflow Setup

### Step 1 — Add a plain text field to REPS

In your REPS CMS collection, add a new **Plain Text** field called `Territory List`.

Populate it with comma-separated territory names:

```
Washington (Western), Washington (Eastern), Idaho (Northern), Oregon
```

For full-state coverage, just use the state name (no parentheses):

```
Colorado, Wyoming, Montana
```

### Step 2 — Add elements inside each Rep Collection Item

Inside your REPS Collection List, within each **Collection Item**, add:

1. **A Text Block** bound to the `Territory List` CMS field
   - Add custom attribute: `data-territories` (no value needed — the CMS text IS the value)
   - Optionally set to `display: none` in Webflow (the script hides it anyway)

2. **A Div Block** where the tags will render
   - Add custom attribute: `data-territory-target` (no value needed)

Both elements should be **siblings** inside the same Collection Item wrapper.

### Step 3 — Add the code to your project

**CSS** — Go to Project Settings → Custom Code → Head Code:

```html
<style>
  /* Paste contents of territories.css here */
</style>
```

**JS** — Go to Project Settings → Custom Code → Footer Code (or page-level Before `</body>` tag):

```html
<script>
  /* Paste contents of territories.js here */
</script>
```

## Configuration

In `territories.js`, there's a config toggle at the top:

```js
const GROUPED = true;
```

- `true` (default) — Groups regions by state: `Washington  Western · Eastern`
- `false` — Flat tags, one per territory: `Washington (Western)`, `Washington (Eastern)`

## Files

| File | Purpose |
|------|---------|
| `territories.js` | Parses text field, groups by state, renders tags |
| `territories.css` | Styles for the tag layout (dark theme, adjust to match your site) |

## Notes

- No external dependencies (no jQuery, no Finsweet)
- No extra HTTP requests — everything runs from data already on the page
- Works with any number of territories per rep
- The CSS assumes a dark background (like your current site) — adjust colors to match your theme
