import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function EnvWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [missingVars, setMissingVars] = useState<string[]>([]);

  useEffect(() => {
    // Check for missing environment variables
    const missing: string[] = [];
    
    if (!import.meta.env.VITE_SUPABASE_URL) {
      missing.push("VITE_SUPABASE_URL");
    }
    
    if (!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY && !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      missing.push("VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY");
    }

    if (missing.length > 0) {
      setMissingVars(missing);
      setShowWarning(true);
    }
  }, []);

  if (!showWarning) return null;

  return (
    <Alert variant="destructive" className="m-4 border-2">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>⚠️ Missing Environment Variables</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">The following environment variables are not set:</p>
        <ul className="list-disc list-inside mb-2">
          {missingVars.map((varName) => (
            <li key={varName} className="font-mono text-sm">
              {varName}
            </li>
          ))}
        </ul>
        <p className="text-sm mt-2">
          Queste variabili vengono configurate nelle impostazioni del progetto (non tramite file <code className="bg-muted px-1 rounded">.env</code> in preview).
        </p>
      </AlertDescription>
    </Alert>
  );
}

