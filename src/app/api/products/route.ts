import { NextResponse } from 'next/server';
import { runComprehensiveSafetyAudit } from '@/lib/anti-phishing';

function sanitizeString(str: any, maxLength = 255): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sellerId, title, categoryId, pricePerUnit, unit, minimumOrderQty } = body;

    const cleanSellerId = sanitizeString(sellerId, 60);
    const cleanTitle = sanitizeString(title, 150);
    const cleanCategory = sanitizeString(categoryId, 50);
    const cleanDesc = sanitizeString(body.description, 2000);
    const numPrice = Number(pricePerUnit);
    const numMoq = Number(minimumOrderQty || 1);

    // Anti-Phishing & Impersonation Check
    const safetyCheck = runComprehensiveSafetyAudit({
      content: `${cleanTitle} ${cleanDesc}`,
    });

    if (!safetyCheck.isSafe) {
      return NextResponse.json(
        {
          error: safetyCheck.reason,
          threatType: safetyCheck.threatType,
        },
        { status: 400 }
      );
    }

    if (!cleanSellerId || !cleanTitle || isNaN(numPrice) || numPrice < 0) {
      return NextResponse.json(
        { error: 'Missing or invalid mandatory product fields: sellerId, title, or pricePerUnit' },
        { status: 400 }
      );
    }

    const createdProduct = {
      id: `prod_${Date.now()}`,
      sellerId: cleanSellerId,
      title: cleanTitle,
      categoryId: cleanCategory || 'cat_industrial',
      pricePerUnit: numPrice,
      currency: 'INR',
      unit: sanitizeString(unit, 30) || 'Units',
      minimumOrderQty: Math.max(1, isNaN(numMoq) ? 1 : numMoq),
      images: Array.isArray(body.images) ? body.images.slice(0, 10).map((img: any) => sanitizeString(img, 500)) : [],
      description: sanitizeString(body.description, 2000),
      specifications: typeof body.specifications === 'object' && body.specifications !== null ? body.specifications : {},
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Product catalog item published successfully.',
      product: createdProduct,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product listing' },
      { status: 500 }
    );
  }
}
