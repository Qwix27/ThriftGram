import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getUserFromToken } from '@/lib/supabase-server';

// Input validation helpers
function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 500);
}

function validatePrice(price: any): number {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice) || numPrice < 0 || numPrice > 1000000) {
    throw new Error('Invalid price. Must be between 0 and 1,000,000');
  }
  return Math.round(numPrice * 100) / 100;
}

function validateStock(stock: any): number {
  const numStock = parseInt(stock);
  if (isNaN(numStock) || numStock < 0 || numStock > 10000) {
    throw new Error('Invalid stock. Must be between 0 and 10,000');
  }
  return numStock;
}

function validateCategory(category: string): string {
  const validCategories = ['Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Accessories'];
  if (!validCategories.includes(category)) {
    throw new Error('Invalid category');
  }
  return category;
}

function validateImages(images: string[]): string[] {
  if (!Array.isArray(images) || images.length === 0) {
    throw new Error('At least one image is required');
  }
  if (images.length > 10) {
    throw new Error('Maximum 10 images allowed');
  }
  return images.filter(img => typeof img === 'string' && img.length > 0).slice(0, 10);
}

export async function POST(request: NextRequest) {
  try {
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
      console.log('❌ API: Invalid token');
      return NextResponse.json(
        { error: 'Invalid authentication token. Please sign in again.' },
        { status: 401 }
      );
    }

    // 2. Verify user is a seller
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_seller')
      .eq('id', user.id)
      .single();

    if (!profile?.is_seller) {
      return NextResponse.json(
        { error: 'You must be a seller to create products.' },
        { status: 403 }
      );
    }

    // 3. Get and verify shop ownership
    const { data: shop } = await supabaseAdmin
      .from('shops')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found. Please create a shop first.' },
        { status: 404 }
      );
    }

    // 4. Parse and validate request body
    const body = await request.json();

    if (!body.name || !body.price || !body.category || !body.images) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, category, images' },
        { status: 400 }
      );
    }

    // Sanitize and validate each field
    const validatedData = {
      shop_id: shop.id,
      name: sanitizeString(body.name),
      description: body.description ? sanitizeString(body.description) : null,
      price: validatePrice(body.price),
      category: validateCategory(body.category),
      size: body.size ? sanitizeString(body.size) : null,
      condition: body.condition ? sanitizeString(body.condition) : null,
      material: body.material ? sanitizeString(body.material) : null,
      images: validateImages(body.images),
      stock: validateStock(body.stock || 1),
    };

    // 5. Insert product into database
    const { data: product, error: insertError } = await supabaseAdmin
      .from('products')
      .insert(validatedData)
      .select()
      .single();

    if (insertError) {
      console.error('Product insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create product. Please try again.' },
        { status: 500 }
      );
    }

    // 6. Return success
    return NextResponse.json(
      {
        success: true,
        product,
        message: 'Product created successfully!'
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('API error:', error);
    
    if (error.message.includes('Invalid')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}