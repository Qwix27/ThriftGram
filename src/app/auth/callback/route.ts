// src/app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(`${requestUrl.origin}/auth?error=auth_failed`);
      }

      if (session?.user) {
        // Check if profile exists, create if not (for OAuth users)
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!profile) {
          // Create profile for OAuth user
          const fullName = session.user.user_metadata?.full_name || 
                          session.user.user_metadata?.name || 
                          session.user.email?.split('@')[0] ||
                          'User';

          await supabase.from('profiles').insert({
            id: session.user.id,
            email: session.user.email,
            full_name: fullName,
            is_seller: false,
            avatar_url: session.user.user_metadata?.avatar_url || null,
          });
        }

        // Redirect to home
        return NextResponse.redirect(`${requestUrl.origin}/`);
      }
    } catch (error) {
      console.error('Unexpected auth callback error:', error);
    }
  }

  // If something went wrong, redirect to auth page
  return NextResponse.redirect(`${requestUrl.origin}/auth?error=auth_failed`);
}