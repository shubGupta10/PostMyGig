# Design Pattern Reference

This is the **single source of truth** for UI patterns across every page and component in this project.
Every new page, component, and refactor **must be validated against this document** before it is considered complete.

---

## 1. Page Shell

Every authenticated page must use this exact wrapper:

```tsx
<div className="min-h-screen bg-background p-6">
  <div className="max-w-7xl mx-auto">
    {/* page content */}
  </div>
</div>
```

- **No** `px-4 sm:px-6 lg:px-8 py-8 sm:py-12` variations — use `p-6` uniformly.
- **No** `bg-gradient-to-*` on the page background — always plain `bg-background`.
- Narrower pages (forms, single-column content) may use `max-w-3xl` instead of `max-w-7xl`.

---

## 2. Card

Every card (section container) must follow this exact pattern:

```tsx
<div className="bg-card rounded-2xl border-2 border-border shadow-sm overflow-hidden">
  <div className="p-6 sm:p-8">
    {/* content */}
  </div>
</div>
```

### Rules:
- **Border**: always `border-2 border-border` — never `border border-border` (single width) or `border-destructive/30` (fractional).
- **Radius**: always `rounded-2xl` — never `rounded-3xl`, `rounded-lg`, `rounded-xl` on outer cards.
- **Shadow**: always `shadow-sm` — never `shadow-lg`, `shadow-xl`, `shadow-2xl`.
- **Background**: `bg-card` — never inline `bg-white`, hex values, or gradients.
- When a card has multiple internal sections, use `border-b border-border` dividers between them (not separate stacked cards unless they are semantically independent).

---

## 3. Section Labels (Headings inside cards)

Use this exact pattern for all section headings inside cards — **never** `<h2 className="text-2xl font-bold">`:

```tsx
<p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
  Section Title
</p>
```

- `text-xs` uppercase tracking label — never `text-xl` or `text-2xl` for in-card section headers.
- Do **not** wrap section labels with icon-boxes (no `<div className="w-10 h-10 bg-muted ..."><Icon /></div>` next to headings).
- Page-level `<h1>` (the main page title inside the header card) may be `text-2xl sm:text-3xl font-bold text-foreground`.

---

## 4. Inner Containers (Nested blocks inside cards)

For highlighted blocks, metadata rows, or nested info areas inside a card:

```tsx
<div className="bg-muted rounded-xl p-4 border border-border">
  {/* nested content */}
</div>
```

- Inner containers use `rounded-xl` (one step smaller than the outer card's `rounded-2xl`).
- Inner containers use single `border border-border` (not `border-2`).
- Background is `bg-muted` — never gradients or fractional opacities.

---

## 5. Pill / Tag Badges

For skill tags, feedback type selectors, status indicators:

```tsx
// Skill tag (static):
<span className="bg-secondary text-secondary-foreground rounded-xl px-4 py-2 font-semibold text-sm">
  {skill}
</span>

// Interactive pill (unselected):
<button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-all">

// Interactive pill (selected):
<button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-secondary text-secondary-foreground transition-all">
```

- Selected state uses `bg-secondary text-secondary-foreground`.
- **No** border on pills unless it is a shadcn `<Badge>` component.
- **No** gradients on pills.

---

## 6. Status Badges (shadcn Badge)

```tsx
<Badge className="bg-primary text-primary-foreground border-primary border font-medium flex items-center gap-1.5 px-2.5 py-1">
  <Icon className="w-3 h-3" /> Label
</Badge>
```

Status color map (always solid, no fractional opacity):
| Status | Class |
|---|---|
| Accepted / Active | `bg-primary text-primary-foreground border-primary` |
| Pending / Warning | `bg-secondary text-secondary-foreground border-border` |
| Rejected / Error | `bg-destructive text-destructive-foreground border-destructive` |
| Neutral / Info | `bg-muted text-foreground border-border` |

---

## 7. Buttons

Use the shadcn `<Button>` component. Standard variants:

```tsx
// Primary action:
<Button className="bg-primary text-primary-foreground font-semibold h-11">Label</Button>

// Secondary / outline:
<Button variant="outline" className="border-border font-semibold">Label</Button>

// Destructive:
<Button className="bg-destructive text-destructive-foreground font-semibold">Delete</Button>

// Full-width form submit:
<Button type="submit" className="w-full h-12 bg-primary text-primary-foreground font-bold text-base rounded-xl">
  Submit
</Button>
```

- **No** `hover:bg-primary/90` — use `hover:opacity-90` or leave default shadcn hover.
- **No** gradient backgrounds on buttons.

---

## 8. Form Fields

```tsx
<div className="space-y-2">
  <label className="text-sm font-semibold text-foreground">Field Label</label>
  <Input className="h-11 bg-background border-border" />
  <p className="text-xs text-muted-foreground">Helper text</p>
</div>
```

For textareas:
```tsx
<Textarea className="bg-background border-2 border-border focus:border-primary resize-none" />
```

- Read-only fields: `bg-muted border-border text-muted-foreground cursor-not-allowed`.
- Forms are grouped into a single card with `border-b border-border` separating sections.

---

## 9. Empty States

```tsx
<div className="bg-muted rounded-xl p-10 text-center border border-border">
  <Icon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
  <p className="text-foreground font-semibold">Nothing here yet</p>
  <p className="text-muted-foreground text-sm mt-1">Supporting description text</p>
</div>
```

- Icon wrapper: no extra box — icon goes directly inside the div.
- **No** gradient backgrounds on empty states.

---

## 10. Loading & Error States (route-level)

### loading.tsx
```tsx
import { Loader2 } from "lucide-react"
export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
```

### error.tsx
```tsx
"use client"
import { AlertTriangle } from "lucide-react"
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-destructive text-destructive-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <button onClick={reset} className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold">
          Try Again
        </button>
      </div>
    </div>
  )
}
```

---

## 11. Architecture Rules (per page)

Every feature route must follow this structure:

```
app/(pages)/feature-name/
├── page.tsx          ← Server Component only. Fetches data, renders static layout.
├── loading.tsx       ← Route-level loading skeleton
├── error.tsx         ← Route-level error boundary ("use client")
├── types/
│   └── index.ts      ← All TypeScript interfaces for this feature
└── services/
    └── featureService.ts  ← All fetch/API calls. No inline fetch in components.

components/feature-name/
├── FeatureClient.tsx      ← Main client component with state/interactions
└── SubComponent.tsx       ← Sub-components (modals, cards, etc.)
```

- `page.tsx` must **never** be `"use client"`.
- No inline `fetch()` calls inside React components — always import from `services/`.
- No types defined inside page or component files — always in `types/index.ts`.

---

## 12. Strictly Forbidden Patterns

| ❌ Forbidden | ✅ Use instead |
|---|---|
| `bg-gradient-to-*` anywhere | `bg-card`, `bg-muted`, `bg-background` |
| `bg-primary/20`, `border-destructive/30` (fractional) | `bg-muted`, `border-border` |
| `text-yellow-400`, `text-blue-400` (raw Tailwind colors) | Semantic tokens only |
| `shadow-lg`, `shadow-xl`, `shadow-2xl` | `shadow-sm` |
| `rounded-3xl` on cards | `rounded-2xl` |
| `border border-border` on outer cards | `border-2 border-border` |
| `text-2xl font-bold` for in-card section headers | `text-xs uppercase tracking-widest text-muted-foreground` |
| Icon-box wrappers next to section headings | Plain label text only |
| Hardcoded hex colors in components | CSS variable tokens only |
| `"use client"` on `page.tsx` | Split into Server + Client components |
| Inline `fetch()` in UI components | `services/featureService.ts` |

---

## 13. Inconsistencies Found (Fix Backlog)

These files were found to deviate from this pattern and should be fixed when touched:

| File | Issue |
|---|---|
| `components/profile/ProfileDashboard.tsx` | Unused — superseded by `page.tsx` + `ProfileActions.tsx`. Can be deleted. |
| `app/(pages)/(activity)/activity/page.tsx` | Uses `rounded-xl border border-border` on empty state (should be `border-2`). Uses `max-w-4xl` instead of `max-w-7xl`. |
| `app/(pages)/(gig)/open-gig/[gigId]/page.tsx` | Uses `bg-gradient-to-*` and `rounded-3xl`. Needs cleanup when touched. |
| `app/auth/login/page.tsx` | Uses `rounded-3xl` — auth pages are lower priority but should align. |
| `components/FeedbackDialog.tsx` | Uses `bg-gradient-to-*` — lower priority (dialog overlay). |
| `components/ChatSystem.tsx` | Uses `bg-gradient-to-*` — chat has custom rules, fix separately. |
