-- ============================================================
-- 008: Human Review System (Consultant Verification)
-- ============================================================
-- Enables the "verified by a consultant" workflow:
--   1. Client requests review on an AI-generated deliverable
--   2. Consultant is assigned, reviews/modifies, delivers
--   3. Client sees "✓ Verified by [Consultant Name]" badge

-- ── Consultants (cross-tenant Talsom staff) ──────────────
CREATE TABLE IF NOT EXISTS consultants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  specialties TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE consultants ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "service_role_consultants" ON consultants FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Deliverable Reviews ──────────────────────────────────
CREATE TABLE IF NOT EXISTS deliverable_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  tool_name TEXT NOT NULL,
  original_content TEXT,
  original_file_url TEXT,
  consultant_id UUID REFERENCES consultants(id),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','in_review','approved','needs_revision','delivered')),
  review_notes TEXT,
  client_feedback TEXT,
  modified_content TEXT,
  modified_file_url TEXT,
  price_cents INT NOT NULL DEFAULT 14900,
  currency TEXT DEFAULT 'cad',
  payment_status TEXT DEFAULT 'pending'
    CHECK (payment_status IN ('pending','paid','included','waived')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_deliverable_reviews_tenant
  ON deliverable_reviews(tenant_id, requested_at DESC);

CREATE INDEX IF NOT EXISTS idx_deliverable_reviews_consultant
  ON deliverable_reviews(consultant_id, status);

CREATE INDEX IF NOT EXISTS idx_deliverable_reviews_status
  ON deliverable_reviews(status, requested_at ASC);

ALTER TABLE deliverable_reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "service_role_deliverable_reviews" ON deliverable_reviews FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── Review Config (pricing, SLA) ─────────────────────────
CREATE TABLE IF NOT EXISTS review_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

INSERT INTO review_config (key, value) VALUES
  ('pricing', '{"default_price_cents":14900,"currency":"cad","enterprise_included":true}'),
  ('sla', '{"target_hours":48,"max_hours":72}')
ON CONFLICT (key) DO NOTHING;

-- ── Feature flag: human_review ───────────────────────────
-- Enable for pro and enterprise plans
UPDATE plan_quotas
  SET features = COALESCE(features, '{}'::jsonb) || '{"human_review": true}'::jsonb
  WHERE plan IN ('pro', 'enterprise');

UPDATE plan_quotas
  SET features = COALESCE(features, '{}'::jsonb) || '{"human_review": false}'::jsonb
  WHERE plan IN ('free', 'starter');
