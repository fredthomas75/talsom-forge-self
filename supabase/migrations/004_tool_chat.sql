-- 004_tool_chat.sql
-- Add tool conversation tracking to chat_conversations

ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS tool_name TEXT DEFAULT NULL;
ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS tool_context JSONB DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_convos_tool
  ON chat_conversations(tenant_id, tool_name)
  WHERE tool_name IS NOT NULL;
