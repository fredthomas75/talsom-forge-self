-- ============================================================
-- 010: Consulting Credits System + Invitation Status
-- ============================================================

-- 1. Consulting credits tracking per tenant per billing period
CREATE TABLE IF NOT EXISTS consulting_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  credits_granted INT NOT NULL DEFAULT 0,
  credits_used INT NOT NULL DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, period_start)
);

CREATE INDEX IF NOT EXISTS idx_credits_tenant ON consulting_credits(tenant_id);
CREATE INDEX IF NOT EXISTS idx_credits_period ON consulting_credits(tenant_id, period_start DESC);

-- RLS
ALTER TABLE consulting_credits ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "service_role_consulting_credits" ON consulting_credits FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Extend plan_quotas with consulting credits per month
ALTER TABLE plan_quotas
  ADD COLUMN IF NOT EXISTS consulting_credits_per_month INT DEFAULT 0;

UPDATE plan_quotas SET consulting_credits_per_month = 0   WHERE plan = 'free';
UPDATE plan_quotas SET consulting_credits_per_month = 5   WHERE plan = 'starter';
UPDATE plan_quotas SET consulting_credits_per_month = 25  WHERE plan = 'pro';
UPDATE plan_quotas SET consulting_credits_per_month = -1  WHERE plan = 'enterprise';

-- 3. Add status column to tenant_invitations (used by signup handler)
ALTER TABLE tenant_invitations
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Backfill: mark invitations with accepted_at as 'accepted'
UPDATE tenant_invitations SET status = 'accepted' WHERE accepted_at IS NOT NULL AND status = 'pending';
