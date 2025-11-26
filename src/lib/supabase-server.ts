// Server-side Supabase client for API routes
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// This client bypasses RLS and should only be used in API routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// For validating user tokens - FIXED VERSION
export async function getUserFromToken(token: string) {
  // Use the admin client to get user from JWT token
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  
  if (error || !user) {
    console.log('❌ getUserFromToken failed:', error?.message);
    throw new Error('Invalid authentication token');
  }
  
  return user;
}