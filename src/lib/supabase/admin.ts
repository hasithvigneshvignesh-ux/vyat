import { createClient } from '@supabase/supabase-js';

// IMPORTANT: This client uses the service role key and bypasses RLS.
// It must ONLY be used in server-side code (API routes, server actions).
// NEVER import this in client components or expose it to the browser.

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    'SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations will fail.'
  );
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
