<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may differ from older examples. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code and follow deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Mission
Build a production-grade Health Bridge frontend for patients, doctors, admins, and guests with fast, accessible, secure healthcare workflows.

## Product Surfaces
1. Guest pharmacy: browse medicines, cart, checkout, payment, order tracking.
2. Lab tests: center/test selection, payment-first booking, sample status, report delivery.
3. Ambulance: emergency request, health-center guardrail, live status/location tracking.
4. Appointments: in-person doctor discovery, slot booking, prescription/history access.
5. Telehealth: separate emergency video flow for eligible active doctors.
6. Dashboards: patient, doctor, admin, reports, transactions, notifications.

## Stack
- Next.js App Router in `src/app`
- React + TypeScript strict mode
- Tailwind CSS v4 via `src/app/globals.css`
- Backend integration through typed API clients/server actions
- Forms with typed schemas when form libraries are added
- Keep the active package manager consistent with the lockfile; this repo currently has `package-lock.json`

## Current Structure
```txt
src/
  app/
    layout.tsx
    page.tsx
    globals.css
public/
```

As the app grows, add folders only when needed:
```txt
src/
  app/
  components/
    ui/
    layout/
  features/
    pharmacy/
    labs/
    ambulance/
    appointments/
    telehealth/
    dashboard/
  lib/
    api/
    auth/
    utils/
  hooks/
  types/
```

## Frontend Standards
- Prefer Server Components; use Client Components for browser state, effects, forms, maps, video, and realtime UI.
- Keep routes thin; put feature UI and data helpers in `src/features/*` once a feature grows.
- Keep reusable primitives in `src/components/ui` and app shell pieces in `src/components/layout`.
- Use `@/*` imports from `src/*`.
- Do not expose access tokens, refresh tokens, secrets, or private env values to the browser.
- Enforce role-aware navigation and page guards for patient, doctor, admin, and guest flows.
- Design mobile-first, accessible interfaces with semantic HTML, labels, focus states, keyboard support, and clear loading/error/empty states.
- Avoid Redux unless there is a proven cross-feature state problem; prefer URL state, server data, local state, or small scoped stores.
- Keep components focused; split large files before they become hard to scan.

## API Integration
- Treat the NestJS backend Swagger/OpenAPI contract as the source of truth.
- Centralize fetch/client configuration in `src/lib/api` when backend calls are added.
- Type request/response models and handle `loading`, `success`, `empty`, `validation`, `unauthorized`, and `server error` states.
- Use idempotency keys for payment/order flows when supported by the backend.
- Never hardcode backend URLs outside config/env helpers.

## Quality Gates
- Run `npm run lint` before handoff when files change.
- Add tests when meaningful flows or shared utilities are introduced.
- Verify critical user paths: guest checkout, lab booking, ambulance request, appointment booking, telehealth entry, dashboard access.
- Keep metadata, copy, and UI states aligned with healthcare trust, privacy, and clarity.
