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
    
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_seller, full_name')
      .eq('id', data.user.id)
      .single();

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
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    if (!user) return null;

    // Get profile info
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_seller, full_name, seller_verified, avatar_url')
      .eq('id', user.id)
      .single();

    // Fallback to user metadata if profile name is empty
    const fullName = profile?.full_name || 
                     user.user_metadata?.full_name || 
                     user.user_metadata?.name ||
                     user.email?.split('@')[0] || 
                     'User';

    return {
      ...user,
      isSeller: profile?.is_seller || false,
      fullName: fullName,
      sellerVerified: profile?.seller_verified || false,
      avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || null,
    };
  } catch (error) {
    console.error('Get current user error:', error);
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
export async function becomeSeller(data: {
  shopName: string;
  instagramHandle: string;
  bio?: string;
}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to become a seller');
    }

    // Check if user is already a seller
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_seller')
      .eq('id', user.id)
      .single();

    if (profile?.is_seller) {
      throw new Error('You are already a seller');
    }

    // Update profile to seller
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        is_seller: true,
        seller_bio: data.bio || null,
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('Profile update error:', profileError);
      throw new Error('Failed to update profile');
    }

    // Create shop
    const { error: shopError } = await supabase
      .from('shops')
      .insert({
        owner_id: user.id,
        shop_name: data.shopName,
        instagram_handle: data.instagramHandle,
        bio: data.bio || null,
      });

    if (shopError) {
      console.error('Shop creation error:', shopError);
      
      // Rollback profile update
      await supabase
        .from('profiles')
        .update({ is_seller: false, seller_bio: null })
        .eq('id', user.id);
      
      throw new Error('Failed to create shop. Please try again.');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Become seller error:', error);
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