-- Enable full row data for realtime payloads
ALTER TABLE public.valuation_messages REPLICA IDENTITY FULL;
ALTER TABLE public.valuation_requests REPLICA IDENTITY FULL;

-- Add tables to realtime publication only if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication p
    JOIN pg_publication_rel pr ON pr.prpubid = p.oid
    JOIN pg_class c ON c.oid = pr.prrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE p.pubname = 'supabase_realtime'
      AND n.nspname = 'public'
      AND c.relname = 'valuation_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.valuation_messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication p
    JOIN pg_publication_rel pr ON pr.prpubid = p.oid
    JOIN pg_class c ON c.oid = pr.prrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE p.pubname = 'supabase_realtime'
      AND n.nspname = 'public'
      AND c.relname = 'valuation_requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.valuation_requests;
  END IF;
END $$;