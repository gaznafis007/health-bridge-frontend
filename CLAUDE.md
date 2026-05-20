@AGENTS.md

# CLAUDE.md

## Project Brief
Health Bridge is a healthcare super-app frontend for pharmacy, lab testing, ambulance emergencies, appointments, telehealth, and role-based dashboards.

Use this as the quick contributor playbook. Keep implementation aligned with `AGENTS.md`.

## Priorities
1. Correct user flow and backend contract alignment
2. Security and privacy
3. Accessibility and mobile usability
4. Maintainable feature boundaries
5. Performance and bundle discipline

## Implementation Rules
- Use Next.js App Router conventions under `src/app`.
- Prefer Server Components; add `"use client"` only for interactive browser behavior.
- Keep backend calls typed and centralized in `src/lib/api` once API integration begins.
- Keep feature-specific UI in `src/features/<feature>` when the current `src/app` structure needs to expand.
- Use role-aware layouts and guards for patient, doctor, admin, and guest experiences.
- Provide clear loading, empty, error, payment pending, and unauthorized states.
- Keep forms accessible, validated, and consistent with backend DTOs/OpenAPI schemas.
- Do not store secrets or long-lived tokens in client-accessible code.

## Feature Map
- `pharmacy`: product list, guest cart, checkout, payment, tracking.
- `labs`: centers, tests/packages, booking, sample lifecycle, reports.
- `ambulance`: emergency request, pickup/drop-off, live tracking, status.
- `appointments`: doctors, slots, booking, visit history.
- `telehealth`: emergency video entry, doctor availability, call status.
- `dashboard`: patient, doctor, admin, reports, transactions, notifications.

## Quality Checklist
- Responsive from mobile to desktop.
- Semantic HTML, labels, focus states, keyboard navigation.
- No duplicated feature logic across pages.
- No untyped API payloads for important flows.
- Lint passes with `npm run lint`.
- Critical paths are covered by tests once testing infrastructure exists.
