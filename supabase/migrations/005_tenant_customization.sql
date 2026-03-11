-- 005_tenant_customization.sql
-- Tenant profile and asset management for personalized AI outputs

CREATE TABLE IF NOT EXISTS tenant_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  industry TEXT,
  company_size TEXT,
  headquarters TEXT,
  description TEXT,
  mission_statement TEXT,
  target_audience TEXT,
  key_products TEXT,
  brand_tone TEXT DEFAULT 'professional',
  brand_colors JSONB DEFAULT '{}',
  custom_instructions TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id)
);

CREATE TABLE IF NOT EXISTS tenant_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('brand_guide','logo','template_pptx','template_docx','reference_doc')),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  metadata JSONB DEFAULT '{}',
  uploaded_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assets_tenant ON tenant_assets(tenant_id, asset_type);
