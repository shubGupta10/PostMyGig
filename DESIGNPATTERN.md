# Design Pattern Reference

This is the **single source of truth** for UI patterns across every page and component in this project.
Every new page, component, and refactor **must be validated against this document** before it is considered complete.

---

## 1. Page Shell & Headers

- **Uniform Padding**: Use `p-6` or `p-4 sm:p-6 sm:py-10` on the main page wrapper.
- **Background**: Always use `bg-background` for the page background. Never use gradients (`bg-gradient-to-*`) for the page shell.
- **Page Width**: Use `max-w-7xl` for standard layout widths to maintain consistency across pages.
- **Global Headers**: Do NOT hardcode page titles (e.g., `<h1>Settings</h1>`) or back arrows on individual pages. The application uses a global Project Header (`HeaderTitle` component) that automatically sets the title based on the active route.

---

## 2. Layout Structure (Let the UI Breathe)

- **Not Everything Should Be in a Card**: Do not wrap entire pages or massive sections in a single giant `bg-card`. Let the UI breathe.
- **Standalone Items**: When displaying lists, settings, or distinct pieces of data (like proposals), place each item in its own standalone row or container rather than boxing them all together. 
- **Spacing**: Use standard spacing (`space-y-4` or `space-y-6`) to create gaps between standalone items.

---

## 3. Container & Card Styling

When using cards or standalone rows, adhere to these strict visual rules:

- **Border**: Always use `border-2 border-border`. Never use fractional borders (`border-destructive/30`) or single-width borders (`border border-border`) on primary items.
- **Radius**: Always use `rounded-2xl` for outer items. Never use `rounded-3xl`, `rounded-lg`, or `rounded-xl` on main containers.
- **Shadow**: Always use `shadow-xs` or `shadow-sm`. Never use heavy shadows (`shadow-lg`, `shadow-xl`, `shadow-2xl`).
- **Background**: Use `bg-card` for standard containers. Never use inline `bg-white`, hex values, or gradients.
- **Hover States**: For interactive rows or cards, use `hover:border-border/80 transition-all` to provide responsive feedback.

---

## 4. Typography & Labels

- **Section Labels**: For headings above groups of items, use `text-xs font-bold text-muted-foreground uppercase tracking-widest`.
- **No Large Subheaders**: Never use `<h2 className="text-2xl font-bold">` for section headings.
- **Clean Labels**: Do not wrap section labels with icon-boxes (e.g., placing an icon inside a `bg-muted` square next to a heading). Use plain text.
- **Page Titles**: The main page title is handled by the global header (`text-sm sm:text-base font-semibold tracking-tight`).

---

## 5. Pill / Tag Badges

- **Static Tags**: Use `bg-secondary text-secondary-foreground rounded-xl px-4 py-2 font-semibold text-sm`.
- **Interactive (Unselected)**: Use `bg-background text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl`.
- **Interactive (Selected)**: Use `bg-secondary text-secondary-foreground rounded-xl`.
- **No Borders/Gradients**: Never use borders or gradients on pills.

---

## 6. Status Badges

Always use solid colors for status badges (no fractional opacity):

- **Accepted / Active**: `bg-primary text-primary-foreground border-transparent`
- **Pending / Warning**: `bg-secondary text-secondary-foreground border-border`
- **Rejected / Error**: `bg-destructive text-destructive-foreground border-transparent`
- **Neutral / Info**: `bg-muted text-foreground border-border`

---

## 7. Buttons

Use the standard shadcn Button component with these variant rules:

- **Primary Action**: `bg-primary text-primary-foreground font-semibold`
- **Secondary / Outline**: `variant="outline" border-border font-semibold`
- **Destructive**: `bg-destructive text-destructive-foreground font-semibold`
- **No Gradients**: Never use gradient backgrounds on buttons.
- **Hover States**: Use default shadcn hover states or `hover:opacity-90`. Do not use `hover:bg-primary/90`.

---

## 8. Strictly Forbidden Patterns

| ❌ Forbidden | ✅ Use instead |
|---|---|
| Hardcoding page titles and back arrows | Rely on the global `HeaderTitle` component |
| Wrapping the entire page in a single giant card | Use standalone rows to let the UI breathe |
| `bg-gradient-to-*` anywhere | `bg-card`, `bg-muted`, `bg-background` |
| `text-yellow-400`, `text-blue-400` (raw Tailwind colors) | Semantic tokens only (`text-primary`, `text-destructive`) |
| `shadow-lg`, `shadow-xl`, `shadow-2xl` | `shadow-xs` or `shadow-sm` |
| `rounded-3xl` on cards | `rounded-2xl` |
| `border border-border` on outer items | `border-2 border-border` |
| Hardcoded hex colors | CSS variable tokens only |
