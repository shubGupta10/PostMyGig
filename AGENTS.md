# AGENTS.md

This file defines the canonical working rules and design system guidelines for the entire `postmygig` workspace, including the Next.js app in `postmygig/` and the chat server in `postmygig-chat-server/`.

---

## 1. Source Of Truth & Color Tokens

- Treat [app/globals.css](app/globals.css) as the canonical design token file.
- Use only the semantic tokens defined in `app/globals.css`:
  - `background` / `foreground`
  - `card` / `card-foreground`
  - `popover` / `popover-foreground`
  - `primary` / `primary-foreground`
  - `secondary` / `secondary-foreground`
  - `muted` / `muted-foreground`
  - `accent` / `accent-foreground`
  - `destructive` / `destructive-foreground`
  - `border` / `input` / `ring`
  - `chart-1` through `chart-5`
  - `sidebar` tokens

### Color Rules:
- Prefer `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `bg-primary`, `text-primary-foreground`, `bg-muted`, `text-muted-foreground`, `border-border`.
- **NO Fractional Opacity Variants**: Do not use opacity modifier suffixes like `bg-primary/10`, `bg-primary/20`, `text-foreground/70`, or `hover:from-secondary-foreground/90`. Use semantic tokens directly (`bg-muted`, `bg-accent`, `bg-card`).
- **NO Hardcoded Hex Colors**: Do not introduce raw hex values (`#fff`, `#111`, `#644a40`) in component files.
- Keep light and dark mode behavior fully aligned by relying on semantic CSS variables.

---

## 2. Typography & Font Weight Rules

- **Restrain Font Bolding**: Do not use `font-bold` or `font-extrabold` indiscriminately across every element.
- **Hierarchy Standard**:
  - `text-2xl` to `text-4xl` `font-bold` reserved exclusively for main page titles (`<h1>`).
  - `text-lg` to `text-xl` `font-semibold` for section headings and card titles.
  - `text-sm` `font-medium` for buttons, tabs, input labels, and status badges.
  - `text-xs` / `text-sm` `font-normal` for body text, descriptions, timestamps, and metadata.
- **Clean Headings**: Remove arbitrary/gimmicky decorative pill tags (e.g., `[Pulse icon] Dashboard Overview`) above main page headings. Keep headers clean, executive, and purposeful.

---

## 3. Spacing, Layout & Breathing Room

- **Page Shell**: Wrap page contents in a spacious, breathable container:
  `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8`
- **Card Breathing Room**:
  - Main cards must use comfortable internal padding (`p-6` or `p-5`). Never cram text against borders.
  - Card grids should use `gap-6` on desktop and `gap-4` on mobile.
- **Form Layout Rhythm**:
  - Use `space-y-4` or `space-y-5` for form field groups.
  - Maintain a strict 8px (`space-y-2`) spacing between labels, inputs, and error/helper text.
- **Visual Balance**: Maintain deliberate vertical gaps between header, metric cards, tab navigation, and list views.

---

## 4. Architecture & Code Organization Standards

### A. Types Isolation (`types.ts`)
- Do NOT define TypeScript interfaces or types inside page (`page.tsx`) or component files.
- Move all domain interfaces, props, and API response types into a feature-level `types.ts` file (e.g. `app/dashboard/types.ts` or `types/dashboard.ts`).
- Import types cleanly using standard TypeScript `import type { ... } from './types'`.

### B. API / Data-Fetching Separation (`services/` or `api.ts`)
- Do NOT make direct inline `fetch()` calls or handle HTTP header parsing inside React UI components.
- Extract API calls into dedicated service functions inside a feature API module (e.g. `app/dashboard/services/dashboardApi.ts`).
- UI components should call typed async service functions and handle state/rendering cleanly.

### C. Modular Sub-Component Architecture
- Pages must act as orchestrator components that compose small, focused sub-components.
- Keep sub-components modular and reusable, placed cleanly inside feature folders or component directories.

---

## 5. Security & Change Policy

- Keep authentication checks explicit on protected pages/routes.
- Make targeted changes page-by-page.
- Validate every refactored page with zero syntax/type errors before proceeding to the next page.

---

## 6. Design Pattern Compliance (MANDATORY)

**Before writing or editing any UI component or page, you MUST read and follow [DESIGNPATTERN.md](DESIGNPATTERN.md).**

This document is the single source of truth for:
- Page shell layout (`min-h-screen bg-background p-6 > max-w-7xl mx-auto`)
- Card structure (`bg-card rounded-2xl border-2 border-border shadow-sm`)
- Section label style (`text-xs font-bold uppercase tracking-widest text-muted-foreground`)
- Inner container style (`bg-muted rounded-xl p-4 border border-border`)
- Pill/badge/button patterns
- Loading and error page templates
- Architecture rules (Server page + Client component + services/ + types/)
- Forbidden patterns (gradients, fractional opacities, raw colors, shadow-lg, rounded-3xl)

### Validation Checklist (run before finishing any page)
- [ ] Page shell uses `min-h-screen bg-background p-6` + `max-w-7xl mx-auto`
- [ ] All cards use `bg-card rounded-2xl border-2 border-border shadow-sm`
- [ ] Section labels use `text-xs uppercase tracking-widest` — not `text-2xl font-bold`
- [ ] No `bg-gradient-to-*` anywhere
- [ ] No fractional opacities (`/10`, `/20`, `/30`, etc.)
- [ ] No raw Tailwind color classes (`text-yellow-400`, `text-blue-500`, etc.)
- [ ] No `shadow-lg`, `shadow-xl`, `shadow-2xl`
- [ ] No `rounded-3xl` on cards
- [ ] All API calls are in `services/` — no inline `fetch()` in components
- [ ] All types are in `types/index.ts` — no interfaces in component files
- [ ] `page.tsx` is a Server Component (no `"use client"`)
- [ ] `loading.tsx` and `error.tsx` exist for every route