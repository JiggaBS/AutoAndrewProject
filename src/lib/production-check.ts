/**
 * Production environment validation utilities
 * Ensures critical security settings are configured in production
 */

/**
 * Validates that required production environment variables are set
 * Throws in production if critical vars are missing
 */
export function validateProductionEnv(): void {
  const isProduction = import.meta.env.PROD;
  
  if (!isProduction) {
    // In development, just warn
    return;
  }
  
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_PUBLISHABLE_KEY',
  ];
  
  const missing: string[] = [];
  
  for (const varName of requiredVars) {
    const value = import.meta.env[varName];
    if (!value || typeof value !== 'string' || value.trim() === '') {
      missing.push(varName);
    }
  }
  
  if (missing.length > 0) {
    const errorMessage = `CRITICAL: Missing required environment variables in production: ${missing.join(', ')}. The application cannot run securely without these.`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  
  // Additional production-specific validations
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl) {
    // Ensure URL is HTTPS in production
    if (!supabaseUrl.startsWith('https://')) {
      console.warn('WARNING: Supabase URL should use HTTPS in production');
    }
    
    // Warn if using placeholder or localhost URLs
    if (supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1') || supabaseUrl.includes('placeholder')) {
      throw new Error(`INVALID: Supabase URL appears to be a placeholder or localhost URL in production: ${supabaseUrl}`);
    }
  }
}

/**
 * Checks if the application is running in a secure context (HTTPS)
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') {
    return true; // Server-side, assume secure
  }
  
  // Check if running on HTTPS or localhost (for development)
  return window.location.protocol === 'https:' || 
         window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
}

/**
 * Validates CORS configuration for production
 * This should be called server-side in edge functions
 */
export function validateCorsConfig(allowedOrigins: string[] | null): void {
  const isProduction = Deno?.env?.get('ENVIRONMENT') === 'production' || 
                       !Deno?.env?.get('ENVIRONMENT'); // Assume production if not explicitly set to dev
  
  if (isProduction && (!allowedOrigins || allowedOrigins.length === 0)) {
    console.error('CRITICAL: ALLOWED_ORIGINS must be set in production for CORS security');
    throw new Error('CORS configuration error: ALLOWED_ORIGINS is required in production');
  }
  
  // Validate that origins are HTTPS in production
  if (isProduction && allowedOrigins) {
    for (const origin of allowedOrigins) {
      if (!origin.startsWith('https://') && !origin.includes('localhost')) {
        console.warn(`WARNING: CORS origin should use HTTPS in production: ${origin}`);
      }
    }
  }
}
