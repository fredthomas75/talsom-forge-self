-- ============================================================
-- 003: Client Portal Multi-Tenant Schema
-- ============================================================

-- 1. User-to-tenant bridge table
CREATE TABLE IF NOT EXISTS tenant_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  invited_by UUID,
  invited_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_members_user ON tenant_members(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_members_tenant ON tenant_members(tenant_id);

-- 2. Pending invitations
CREATE TABLE IF NOT EXISTS tenant_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  invited_by UUID NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invitations_email ON tenant_invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON tenant_invitations(token);

-- 3. Audit logs (Loi 25 compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_tenant_date ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);

-- 4. Plan quotas
CREATE TABLE IF NOT EXISTS plan_quotas (
  plan TEXT PRIMARY KEY CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  max_api_calls_per_month INT NOT NULL,
  max_tokens_per_month BIGINT NOT NULL,
  max_team_members INT NOT NULL,
  max_api_keys INT NOT NULL,
  max_conversations INT NOT NULL,
  features JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO plan_quotas (plan, max_api_calls_per_month, max_tokens_per_month, max_team_members, max_api_keys, max_conversations, features) VALUES
  ('free',       100,      50000,    1,  1,   10,  '{"mcp_tools": false, "export": false, "audit_log": false}'),
  ('starter',   2000,    500000,    3,  3,   50,  '{"mcp_tools": true,  "export": false, "audit_log": true}'),
  ('pro',      10000,   5000000,   10, 10,  500,  '{"mcp_tools": true,  "export": true,  "audit_log": true}'),
  ('enterprise', -1,        -1,   -1, -1,   -1,  '{"mcp_tools": true,  "export": true,  "audit_log": true}')
ON CONFLICT (plan) DO NOTHING;

-- 5. Extend chat_conversations
ALTER TABLE chat_conversations
  ADD COLUMN IF NOT EXISTS user_id UUID,
  ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'New conversation',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_conversations_user ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_tenant_user ON chat_conversations(tenant_id, user_id);

-- 6. Extend tenants for billing & branding
ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS billing_email TEXT,
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS created_by UUID,
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- 7. RLS policies
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_quotas ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "service_role_tenant_members" ON tenant_members FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "service_role_tenant_invitations" ON tenant_invitations FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "service_role_audit_logs" ON audit_logs FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "public_read_plan_quotas" ON plan_quotas FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "service_role_plan_quotas" ON plan_quotas FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
