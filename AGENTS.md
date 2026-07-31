# AGENTS.md

This file defines the working rules for the entire `postmygig` workspace, including the Next.js app in `postmygig/` and the chat server in `postmygig-chat-server/`.

## 1. Source Of Truth

- Treat [app/globals.css](app/globals.css) as the canonical design token file.
- Do not introduce new color tokens, spacing systems, shadows, or font stacks unless they are added to [app/globals.css](app/globals.css) first.
- Keep all new UI and backend work aligned with the existing product direction: clean, warm, privacy-first, and practical.

## 2. Color Rules

Use the semantic tokens already defined in [app/globals.css](app/globals.css):

- `background`
- `foreground`
- `card`
- `card-foreground`
- `popover`
- `popover-foreground`
- `primary`
- `primary-foreground`
- `secondary`
- `secondary-foreground`
- `muted`
- `muted-foreground`
- `accent`
- `accent-foreground`
- `destructive`
- `destructive-foreground`
- `border`
- `input`
- `ring`
- `chart-1` through `chart-5`
- `sidebar` tokens

Rules:

- Prefer `bg-primary`, `text-primary`, `border-border`, `bg-background`, `text-foreground`, and similar token classes.
- Do not use new opacity variants like `bg-primary/10`, `bg-primary/20`, `text-foreground/70`, or similar fractional color suffixes in new code.
- Do not invent one-off hex colors in components unless a real token is missing.
- If a new visual state is needed, add a proper semantic token first, then use it everywhere.
- Keep light and dark mode behavior consistent by using the shared tokens, not hard-coded colors.

## 3. Spacing And Layout Rules

- Use a consistent spacing scale across pages and components.
- Prefer existing Tailwind spacing values and keep padding/gap choices repeated across the app where possible.
- Do not mix many different spacing systems in the same flow.
- Keep section spacing, card padding, and form spacing deliberate and breathable.
- Favor larger, cleaner gaps over crowded layouts.
- Use consistent corner radius values from the established design language.

Practical intent:

- Page sections should feel open.
- Cards should have enough internal padding to breathe.
- Forms should align labels, inputs, and helper text with a stable rhythm.
- Lists, tables, and dashboards should avoid cramped density unless density is required by function.

## 4. UI Consistency Rules

- Reuse existing UI components before creating a new visual pattern.
- Keep button, input, card, badge, dialog, and table styling consistent across the app.
- Use the same tone for hover, focus, disabled, and active states.
- Avoid introducing new visual styles for the same component type unless there is a strong reason.
- Prefer server rendering when the UI does not need client interactivity.
- Keep animation subtle and purposeful; do not add motion just for decoration.

## 5. Security Rules

- Treat authentication and authorization as mandatory for every protected route.
- Never trust client-provided identifiers for ownership-sensitive actions.
- Avoid exposing private contact information unless the permission model explicitly allows it.
- Keep secrets in environment variables only.
- Do not log tokens, passwords, email passwords, OTPs, or private user data.
- Prefer safe defaults for email, password reset, ping, and admin flows.

## 6. Chat Server Rules

- Keep the chat server behavior aligned with the Next.js app contracts.
- Do not duplicate business rules in the chat server if the main app already owns them.
- Keep socket events predictable, validated, and minimal.
- Avoid leaking private message metadata to unauthorized users.

## 7. Change Policy

- Do not edit the whole codebase at once.
- Make targeted changes, validate them, then expand.
- Preserve existing behavior unless the task explicitly requires a change.
- Start with shared UI consistency work before backend optimization unless a backend bug is blocking the app.
- When backend optimization begins, start with the heaviest list/dashboard endpoints first.

## 8. Recommended Working Order

1. Centralize or confirm tokens in [app/globals.css](app/globals.css).
2. Define the rule in this file.
3. Apply the rule to shared components and high-traffic screens.
4. Clean up the most visible UI violations first.
5. Validate with build, lint, or focused runtime checks.

## 9. Current Priority

- Keep new work token-driven.
- Keep spacing consistent.
- Avoid new opacity-based color utilities in fresh code.
- Keep security and permission checks explicit.