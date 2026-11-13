CREATE TABLE users(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),email text NOT NULL UNIQUE CHECK(email=lower(email)),password_hash text NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE sessions(token_hash text PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at timestamptz NOT NULL);
CREATE INDEX sessions_expiry ON sessions(expires_at);
CREATE TABLE merchants(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),owner_id uuid NOT NULL REFERENCES users(id),name text NOT NULL CHECK(length(name) BETWEEN 1 AND 120),category text NOT NULL,location text NOT NULL,language text NOT NULL,timezone text NOT NULL,goals text NOT NULL DEFAULT '',version integer NOT NULL DEFAULT 1,created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX merchants_owner ON merchants(owner_id);
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants FORCE ROW LEVEL SECURITY;
CREATE POLICY owner_scope ON merchants USING(owner_id=nullif(current_setting('app.user_id',true),'')::uuid) WITH CHECK(owner_id=nullif(current_setting('app.user_id',true),'')::uuid);
CREATE TABLE audit_logs(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),merchant_id uuid NOT NULL REFERENCES merchants(id),actor_id uuid NOT NULL REFERENCES users(id),event text NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs FORCE ROW LEVEL SECURITY;
CREATE POLICY audit_owner ON audit_logs USING(EXISTS(SELECT 1 FROM merchants WHERE id=merchant_id)) WITH CHECK(actor_id=nullif(current_setting('app.user_id',true),'')::uuid AND EXISTS(SELECT 1 FROM merchants WHERE id=merchant_id));
-- Phase 1 exposes owner-only workspaces. Invitations require a later verified journey.
