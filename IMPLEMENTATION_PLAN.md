# Implementation plan
Current phase: 1, implementation written; verification pending. No full product or production deployment claimed.

## Completed
- [x] Architecture review and planning documents prepared.
- [x] GitHub write and workflow access verified.
- [x] Remote npm/PostgreSQL prerequisite workflow passed.
- [x] Write React/Vite frontend and Express TypeScript API.
- [x] Write shared validation, session auth, CSRF/Origin checks and rate limits.
- [x] Write migration runner, owner-isolated PostgreSQL RLS and runtime-role check.
- [x] Write onboarding/profile read/edit/logout/login journey with optimistic concurrency.
- [x] Write API security/isolation tests and desktop/mobile Playwright journey.
- [x] Configure remote checks and dependency lockfile generation.

## Phase 1 gate
- [ ] CI typecheck, lint, build and API tests pass.
- [ ] Real PostgreSQL isolation and browser journeys pass.
- [ ] Add complete demo seed and resolve core security/UX findings.
- [ ] Verified manual run instructions and phase review.
- [ ] Phase 1 complete. Do not advance yet.

## Remaining phases
- [ ] Phase 2 business records, imports and deterministic dashboard.
- [ ] Phase 3 central copilot and evidence-backed intelligence.
- [ ] Phase 4 digital twin, forecasts, approval-controlled workflows.
- [ ] Phase 5 multilingual voice, customer support and image analysis.
- [ ] Phase 6 sourced market signals, reporting and integrations.
- [ ] Phase 7 security/performance/E2E release gates and deployment.

## Architecture decisions
Phase 1 uses owner-only workspaces. No unimplemented member management UI.
Use Node scrypt (N=32768,r=8,p=3) instead of native Argon2 dependency; hashed random sessions, HttpOnly cookies and explicit Origin/CSRF validation.
Runtime database role must not own tables or bypass RLS. User scope is transaction-local.
Password recovery/email verification, distributed rate-limit store, multi-member roles and session cleanup must be resolved before production readiness.
Raw passwords, session tokens, customer data and provider secrets must never be logged.
Every task and phase requires evidence before its checkbox is completed.
