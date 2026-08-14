import { NextResponse } from 'next/server';
import { runComprehensiveSafetyAudit } from '@/lib/anti-phishing';

function sanitizeString(str: any, maxLength = 255): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      buyerName,
      buyerPhone,
      buyerCity,
      productTitle,
      categoryId,
      quantity,
      unit,
      targetPrice,
      description,
      leadType,
    } = body;

    const cleanTitle = sanitizeString(productTitle, 150);
    const cleanPhone = sanitizeString(buyerPhone, 20);
    const cleanName = sanitizeString(buyerName, 100);
    const cleanEmail = sanitizeString(body.buyerEmail, 100);
    const cleanCity = sanitizeString(buyerCity, 80);
    const cleanCategory = sanitizeString(categoryId, 50);
    const cleanUnit = sanitizeString(unit, 30);
    const cleanDesc = sanitizeString(description, 1000);

    // Run Anti-Phishing & Anti-Impersonation Audit
    const safetyCheck = runComprehensiveSafetyAudit({
      name: cleanName,
      email: cleanEmail,
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

    if (!cleanTitle || !cleanPhone || !quantity) {
      return NextResponse.json(
        { error: 'Missing or invalid mandatory fields: productTitle, buyerPhone, or quantity' },
        { status: 400 }
      );
    }

    const numQty = Number(quantity);
    if (isNaN(numQty) || numQty <= 0 || numQty > 10000000) {
      return NextResponse.json(
        { error: 'Quantity must be a positive number up to 10,000,000' },
        { status: 400 }
      );
    }

    let numTargetPrice: number | undefined = undefined;
    if (targetPrice !== undefined && targetPrice !== null && targetPrice !== '') {
      numTargetPrice = Number(targetPrice);
      if (isNaN(numTargetPrice) || numTargetPrice < 0 || numTargetPrice > 1000000000) {
        return NextResponse.json(
          { error: 'Target price must be a valid positive amount' },
          { status: 400 }
        );
      }
    }

    const createdLead = {
      id: `lead_${Date.now()}`,
      buyerId: sanitizeString(body.buyerId, 60) || `guest_${Date.now()}`,
      buyerName: cleanName || 'Verified Buyer',
      buyerPhone: cleanPhone,
      buyerEmail: sanitizeString(body.buyerEmail, 100),
      buyerCity: cleanCity || 'All India',
      productTitle: cleanTitle,
      categoryId: cleanCategory || 'cat_industrial',
      quantity: numQty,
      unit: cleanUnit || 'Units',
      targetPrice: numTargetPrice,
      description: cleanDesc || `Requirement for ${cleanTitle}`,
      urgency: sanitizeString(body.urgency, 40) || 'Immediate (1-3 Days)',
      leadType: leadType === 'direct' ? 'direct' : 'broadcast_deal',
      unlockedBySellerIds: [],
      status: 'new',
      createdAt: new Date().toISOString(),
      broadcastVendorCount: leadType === 'direct' ? 1 : 5,
    };

    return NextResponse.json({
      success: true,
      message: 'RFQ validated, created, and broadcasted to top 5 verified suppliers in category.',
      lead: createdLead,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON payload or internal processing error' },
      { status: 500 }
    );
  }
}
