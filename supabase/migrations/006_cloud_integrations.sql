-- ============================================================
-- 006: Cloud Integrations (Google Workspace + Microsoft 365)
-- ============================================================

-- 1. OAuth connections table
CREATE TABLE IF NOT EXISTS tenant_oauth_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'microsoft')),
  provider_account_id TEXT,
  access_token_enc TEXT NOT NULL,
  refresh_token_enc TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ,
  scopes TEXT[] DEFAULT '{}',
  account_email TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_oauth_tenant_provider
  ON tenant_oauth_connections(tenant_id, provider) WHERE status = 'active';

-- 2. RLS
ALTER TABLE tenant_oauth_connections ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "service_role_oauth_connections" ON tenant_oauth_connections FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. Add cloud_integrations feature flag to plan_quotas
UPDATE plan_quotas SET features = features || '{"cloud_integrations": false}' WHERE plan = 'free';
UPDATE plan_quotas SET features = features || '{"cloud_integrations": false}' WHERE plan = 'starter';
UPDATE plan_quotas SET features = features || '{"cloud_integrations": true}' WHERE plan = 'pro';
UPDATE plan_quotas SET features = features || '{"cloud_integrations": true}' WHERE plan = 'enterprise';
