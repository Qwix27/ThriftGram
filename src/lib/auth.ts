import { supabase } from './supabase';

export async function signUp(formData: {
  email: string;
  password: string;
  fullName: string;
  userType: 'customer' | 'shop_owner';
  shopName?: string;
  instagramHandle?: string;
}) {
  try {
    // Step 1: Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('No user returned from signup');
    }

    console.log('User created:', authData.user.id);

    // Step 2: Wait a moment for the user to be fully created
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 3: Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: formData.email,
        full_name: formData.fullName,
        user_type: formData.userType,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't throw - profile might already exist from trigger
    }

    // Step 4: If shop owner, create shop
    if (formData.userType === 'shop_owner' && formData.shopName && formData.instagramHandle) {
      const { error: shopError } = await supabase
        .from('shops')
        .insert({
          owner_id: authData.user.id,
          shop_name: formData.shopName,
          instagram_handle: formData.instagramHandle,
        });

      if (shopError) {
        console.error('Shop creation error:', shopError);
        throw shopError;
      }
    }

    return authData;
  } catch (error) {
    console.error('Signup process error:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign in error:', error);
    throw error;
  }

  console.log('Sign in successful:', data);
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`
    }
  });
  
  if (error) throw error;
  return data;
}