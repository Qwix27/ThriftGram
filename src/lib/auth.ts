import { supabase } from './supabase';

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}

export async function signUp(formData: SignUpData) {
  try {
    // Step 1: Sign up the user - everyone starts as a buyer
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        },
        emailRedirectTo: typeof window !== 'undefined' 
          ? `${window.location.origin}/auth/callback`
          : undefined,
      }
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('No user returned from signup');
    }

    console.log('User created:', authData.user.id);

    // Step 2: Verify profile was created by trigger
    let retries = 0;
    const maxRetries = 5;
    let profileCreated = false;

    while (retries < maxRetries && !profileCreated) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, is_seller')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profile) {
        profileCreated = true;
        console.log('Profile verified:', profile);
      } else if (retries === maxRetries - 1) {
        console.warn('Profile not found, creating manually');
        const { error: manualProfileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.fullName,
            is_seller: false,
          });
        
        if (manualProfileError && manualProfileError.code !== '23505') {
          console.error('Manual profile creation error:', manualProfileError);
        } else {
          profileCreated = true;
        }
      }
      
      retries++;
    }

    return {
      user: authData.user,
      session: authData.session,
    };
  } catch (error: any) {
    console.error('Signup process error:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Login failed. Please try again.');
    }

    console.log('Sign in successful:', data.user.id);
    
    // Get user profile with FRESH data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_seller, full_name')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    console.log('Profile data on signin:', profile);

    return {
      user: data.user,
      session: data.session,
      isSeller: profile?.is_seller || false,
      fullName: profile?.full_name || '',
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    console.log('🔍 getCurrentUser: Starting...');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ getCurrentUser: Auth error:', userError);
      throw userError;
    }
    
    if (!user) {
      console.log('❌ getCurrentUser: No user found');
      return null;
    }

    console.log('✅ getCurrentUser: Auth user found:', user.id);

    // CRITICAL FIX: Get FRESH profile data directly from database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, is_seller, seller_verified, avatar_url')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('❌ getCurrentUser: Profile fetch error:', profileError);
      // If profile doesn't exist, return basic user info
      return {
        ...user,
        isSeller: false,
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        sellerVerified: false,
        avatarUrl: user.user_metadata?.avatar_url || null,
      };
    }

    console.log('📊 getCurrentUser: Raw profile from DB:', profile);
    console.log('📊 getCurrentUser: is_seller value:', profile.is_seller);
    console.log('📊 getCurrentUser: is_seller type:', typeof profile.is_seller);

    // Fallback to user metadata if profile name is empty
    const fullName = profile.full_name || 
                     user.user_metadata?.full_name || 
                     user.user_metadata?.name ||
                     user.email?.split('@')[0] || 
                     'User';

    const userData = {
      ...user,
      isSeller: profile.is_seller === true, // Explicitly check for boolean true
      fullName: fullName,
      sellerVerified: profile.seller_verified || false,
      avatarUrl: profile.avatar_url || user.user_metadata?.avatar_url || null,
    };

    console.log('✅ getCurrentUser: Final userData:', {
      id: userData.id,
      email: userData.email,
      isSeller: userData.isSeller,
      fullName: userData.fullName
    });

    return userData;
  } catch (error) {
    console.error('💥 getCurrentUser: Unexpected error:', error);
    return null;
  }
}

export async function signInWithGoogle() {
  try {
    if (typeof window === 'undefined') {
      throw new Error('OAuth must be initiated from the browser');
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Google sign in error:', error);
    throw error;
  }
}

// Become a seller - this upgrades a buyer account to seller
// NOW USES SECURE API ENDPOINT
export async function becomeSeller(data: {
  shopName: string;
  instagramHandle: string;
  bio?: string;
}) {
  try {
    console.log('🏪 becomeSeller: Calling secure API...');
    
    // Get auth session for token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Session expired. Please sign in again.');
    }
    
    const response = await fetch('/api/seller/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        shopName: data.shopName,
        instagramHandle: data.instagramHandle,
        bio: data.bio,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create seller account');
    }

    console.log('✅ becomeSeller: Success via API');
    return { success: true };
  } catch (error: any) {
    console.error('💥 becomeSeller: Error:', error);
    throw error;
  }
}

// Check if user has a shop
export async function getUserShop(userId: string) {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Get user shop error:', error);
    return null;
  }
}