-- Table principale pour le contenu du site
-- À exécuter dans Supabase SQL Editor

CREATE TABLE IF NOT EXISTS content_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide par clé de section
CREATE INDEX IF NOT EXISTS idx_content_sections_key ON content_sections(section_key);

-- Row Level Security
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;

-- Lecture publique (le site a besoin de lire le contenu)
CREATE POLICY "Public read access" ON content_sections
  FOR SELECT USING (true);

-- Écriture réservée aux utilisateurs authentifiés (admin CMS)
CREATE POLICY "Authenticated write access" ON content_sections
  FOR ALL USING (auth.role() = 'authenticated');

-- Service role a accès complet (pour les API serverless)
CREATE POLICY "Service role full access" ON content_sections
  FOR ALL USING (auth.role() = 'service_role');
