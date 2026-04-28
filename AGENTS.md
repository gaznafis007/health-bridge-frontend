<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Mission

Build production-grade frontend for HealthBridge.

## Stack

- Next.js App Router
- TypeScript strict mode
- Tailwind
- Shadcn
- NextAuth
- RHF + Zod

## Rules

1. Use server components by default
2. Use client only when needed
3. Reusable components only
4. No prop drilling
5. Query hooks per feature
6. Forms use RHF + Zod only
7. No Redux
8. Clean responsive UI mandatory
9. Accessibility required
10. Keep bundle small

## Code Standard

- components PascalCase
- hooks camelCase
- feature folders
- max file size 250 lines

## Performance

- lazy load heavy modules
- suspense boundaries
- memo only if needed

## Security

- never expose tokens
- role guard routes
- sanitize user html