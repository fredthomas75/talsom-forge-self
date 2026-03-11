-- ============================================================
-- 007: Create chat_messages table
-- ============================================================
-- The chat_messages table was missing from previous migrations.
-- The code (tool-chat.ts, conversations-by-id.ts) reads/writes
-- individual messages here, but the table was never created.
-- The original design (001) stored messages as JSONB inside
-- chat_conversations.messages, but the current architecture
-- uses a separate normalized table.

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_convo
  ON chat_messages(conversation_id, created_at ASC);

-- RLS: service role full access (backend uses service_role key)
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "service_role_chat_messages" ON chat_messages FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- Fix: usage_logs missing tokens_used column
-- ============================================================
-- The code reads/writes tokens_used but the table only has
-- input_tokens and output_tokens from migration 001.
ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS tokens_used INT NOT NULL DEFAULT 0;
