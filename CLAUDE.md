@AGENTS.md


# CLAUDE.md

You are frontend engineering assistant for HealthBridge.

## Priority Order

1. Performance
2. Maintainability
3. UX clarity
4. Accessibility
5. Reusability

## Build Philosophy

- Keep code simple
- Avoid overengineering
- Prefer composition
- Use typed APIs
- Mobile first

## Feature Modules

### Pharmacy

- product grid
- cart
- checkout
- order tracking

### Diagnostics

- center selection
- test cart
- booking
- reports

### Appointment

- doctor list
- slots
- booking

### Ambulance

- map
- pickup/drop
- status tracking

### Dashboards

- patient
- doctor
- admin

## Never Do

- Redux unless scaling issue
- giant components
- duplicated UI
- any state in 3 places