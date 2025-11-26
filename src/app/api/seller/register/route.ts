import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getUserFromToken } from '@/lib/supabase-server';

// Validation helpers
function sanitizeString(input: string, maxLength: number = 200): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, maxLength);
}

function validateShopName(name: string): string {
  const sanitized = sanitizeString(name, 100);
  
  if (sanitized.length < 3) {
    throw new Error('Shop name must be at least 3 characters long');
  }
  
  if (sanitized.length > 100) {
    throw new Error('Shop name must be less than 100 characters');
  }
  
  // Remove banned words check for now - too restrictive
  // You can add it back later with better logic
  
  return sanitized;
}

function validateInstagramHandle(handle: string): string {
  let sanitized = handle.trim();
  
  if (!sanitized.startsWith('@')) {
    sanitized = '@' + sanitized;
  }
  
  sanitized = sanitized.replace(/[^@a-zA-Z0-9._]/g, '');
  
  if (sanitized.length < 2 || sanitized.length > 31) {
    throw new Error('Instagram handle must be between 1-30 characters');
  }
  
  if (!sanitized.match(/^@[a-zA-Z0-9._]+$/)) {
    throw new Error('Invalid Instagram handle format');
  }
  
  return sanitized;
}

function validateBio(bio: string | undefined): string | null {
  if (!bio) return null;
  
  const sanitized = sanitizeString(bio, 500);
  
  if (sanitized.length > 500) {
    throw new Error('Bio must be less than 500 characters');
  }
  
  return sanitized;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🏪 API: Seller registration started');
    
    // 1. Get and validate auth token
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('❌ API: No authorization header');
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let user;
    
    try {
      user = await getUserFromToken(token);
      console.log('✅ API: User authenticated:', user.id);
    } catch (error) {
      console.log('❌ API: Invalid token:', error);
      return NextResponse.json(
        { error: 'Invalid authentication token. Please sign in again.' },
        { status: 401 }
      );
    }

    // 2. Check if user is already a seller
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_seller')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('❌ API: Profile fetch error:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch profile. Please try again.' },
        { status: 500 }
      );
    }

    if (profile?.is_seller) {
      console.log('⚠️ API: User is already a seller');
      return NextResponse.json(
        { error: 'You are already a seller' },
        { status: 400 }
      );
    }

    // 3. Check if shop already exists
    const { data: existingShop } = await supabaseAdmin
      .from('shops')
      .select('id')
      .eq('owner_id', user.id)
      .maybeSingle();

    if (existingShop) {
      console.log('⚠️ API: Shop already exists');
      return NextResponse.json(
        { error: 'A shop already exists for this account' },
        { status: 400 }
      );
    }

    // 4. Parse and validate request body
    const body = await request.json();

    if (!body.shopName || !body.instagramHandle) {
      return NextResponse.json(
        { error: 'Shop name and Instagram handle are required' },
        { status: 400 }
      );
    }

    // Validate and sanitize inputs
    let validatedData;
    try {
      validatedData = {
        shopName: validateShopName(body.shopName),
        instagramHandle: validateInstagramHandle(body.instagramHandle),
        bio: validateBio(body.bio),
      };
      console.log('✅ API: Data validated:', validatedData);
    } catch (validationError: any) {
      console.error('❌ API: Validation error:', validationError.message);
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 }
      );
    }

    // 5. Check if shop name already exists
    const { data: shopNameCheck } = await supabaseAdmin
      .from('shops')
      .select('id')
      .eq('shop_name', validatedData.shopName)
      .maybeSingle();

    if (shopNameCheck) {
      console.log('⚠️ API: Shop name already taken');
      return NextResponse.json(
        { error: 'Shop name is already taken' },
        { status: 409 }
      );
    }

    // 6. Check if Instagram handle already exists
    const { data: handleCheck } = await supabaseAdmin
      .from('shops')
      .select('id')
      .eq('instagram_handle', validatedData.instagramHandle)
      .maybeSingle();

    if (handleCheck) {
      console.log('⚠️ API: Instagram handle already taken');
      return NextResponse.json(
        { error: 'Instagram handle is already taken' },
        { status: 409 }
      );
    }

    // 7. Update profile to seller
    const { error: profileUpdateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        is_seller: true,
        seller_bio: validatedData.bio,
      })
      .eq('id', user.id);

    if (profileUpdateError) {
      console.error('❌ API: Profile update error:', profileUpdateError);
      return NextResponse.json(
        { error: 'Failed to update profile. Please try again.' },
        { status: 500 }
      );
    }

    console.log('✅ API: Profile updated to seller');

    // 8. Create shop
    const { data: shop, error: shopError } = await supabaseAdmin
      .from('shops')
      .insert({
        owner_id: user.id,
        shop_name: validatedData.shopName,
        instagram_handle: validatedData.instagramHandle,
        bio: validatedData.bio,
      })
      .select()
      .single();

    if (shopError) {
      console.error('❌ API: Shop creation error:', shopError);
      
      // Rollback profile update
      await supabaseAdmin
        .from('profiles')
        .update({ is_seller: false, seller_bio: null })
        .eq('id', user.id);
      
      return NextResponse.json(
        { error: `Failed to create shop: ${shopError.message}` },
        { status: 500 }
      );
    }

    console.log('✅ API: Shop created successfully:', shop.id);

    // 9. Return success
    return NextResponse.json(
      { 
        success: true, 
        shop,
        message: 'Seller account created successfully!' 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('💥 API: Unexpected error:', error);
    
    // Return detailed error for debugging
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}