-- =============================================
-- REMOVE UNUSED INDEXES
-- =============================================
-- These indexes are redundant because we have a composite index
-- idx_valuation_messages_request_created on (request_id, created_at)
-- which covers both use cases more efficiently.
--
-- The composite index can be used for:
-- - Queries filtering by request_id (leftmost column)
-- - Queries filtering by request_id AND ordering by created_at (both columns)
--
-- The single-column indexes are never used because:
-- - idx_valuation_messages_request_id: redundant (composite index covers this)
-- - idx_valuation_messages_created_at: not useful alone (queries always filter by request_id first)

DROP INDEX IF EXISTS public.idx_valuation_messages_request_id;
DROP INDEX IF EXISTS public.idx_valuation_messages_created_at;

-- Verify the composite index still exists (it should)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'valuation_messages'
    AND indexname = 'idx_valuation_messages_request_created'
  ) THEN
    RAISE WARNING 'Composite index idx_valuation_messages_request_created not found!';
  ELSE
    RAISE NOTICE 'Unused indexes removed successfully. Composite index idx_valuation_messages_request_created is still active.';
  END IF;
END $$;
