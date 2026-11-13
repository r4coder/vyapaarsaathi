# VyapaarSaathi

Phase 1 foundation under active development. This is not the complete product.

## Run
Use Node 22.12+ and PostgreSQL 17. Create a restricted runtime role, set MIGRATION_DATABASE_URL for migrations, DATABASE_URL for runtime, RUNTIME_ROLE to the restricted role name, APP_ORIGIN to your exact browser origin, PORT (default 3000).

Run npm ci after the dependency lockfile is committed, npm run db:migrate, npm run build, npm start. Never use the migration database role in the running API. Environment variables must be set in your shell or hosting dashboard; no secrets belong in source.

## Verify
Run npm run typecheck, npm run lint, npm test, and npm run test:e2e against a disposable database. Browser tests register, create a profile, update/reload, logout/login on desktop and mobile. API tests cover CSRF, wrong origin, invalid input, private profile access, RLS and stale writes.

Manual check: open http://localhost:3000, register with a password of at least 12 characters, create a business, edit its profile, reload, then sign out and sign in. Create a second account to verify isolation. Never point tests at production.
