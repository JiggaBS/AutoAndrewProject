import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { setSentryUser, clearSentryUser } from "@/lib/sentry";

/**
 * Component that tracks user authentication state and sets Sentry user context
 * This helps identify which users are experiencing errors
 */
export function SentryUserTracker() {
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSentryUser({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.full_name || session.user.email,
        });
      } else {
        clearSentryUser();
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setSentryUser({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.full_name || session.user.email,
        });
      } else {
        clearSentryUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null; // This component doesn't render anything
}

