import { NextResponse } from 'next/server';

function sanitizeString(str: any, maxLength = 255): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sellerId, buyerId, items, subtotal, taxAmount, grandTotal, validUntil } = body;

    const cleanSellerId = sanitizeString(sellerId, 60);
    const cleanBuyerId = sanitizeString(buyerId, 60);

    if (!cleanSellerId || !cleanBuyerId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid mandatory quotation parameters: sellerId, buyerId, or line items' },
        { status: 400 }
      );
    }

    if (items.length > 50) {
      return NextResponse.json(
        { error: 'Quotation cannot contain more than 50 line items' },
        { status: 400 }
      );
    }

    // Sanitize & validate each line item
    const sanitizedItems = items.map((it: any) => {
      const title = sanitizeString(it.productTitle, 150) || 'Item / Service';
      const qty = Math.max(1, Math.min(10000000, Number(it.qty) || 1));
      const unitPrice = Math.max(0, Math.min(100000000, Number(it.unitPrice) || 0));
      return {
        productTitle: title,
        qty,
        unitPrice,
        total: Math.round(qty * unitPrice),
      };
    });

    const calculatedSubtotal = sanitizedItems.reduce((acc, it) => acc + it.total, 0);
    const rawTaxRate = Number(body.taxRate);
    const validTaxRate = [0, 5, 12, 18, 28].includes(rawTaxRate) ? rawTaxRate : 18;
    const calculatedTaxAmount = Math.round(calculatedSubtotal * (validTaxRate / 100));
    const calculatedGrandTotal = calculatedSubtotal + calculatedTaxAmount;

    const createdQuote = {
      id: `quote_${Date.now()}`,
      leadId: sanitizeString(body.leadId, 60) || undefined,
      sellerId: cleanSellerId,
      sellerName: sanitizeString(body.sellerName, 100) || 'Verified Supplier',
      sellerGSTIN: sanitizeString(body.sellerGSTIN, 20),
      buyerId: cleanBuyerId,
      buyerName: sanitizeString(body.buyerName, 100) || 'Client',
      buyerCompany: sanitizeString(body.buyerCompany, 100) || undefined,
      items: sanitizedItems,
      subtotal: calculatedSubtotal,
      taxRate: validTaxRate,
      taxAmount: calculatedTaxAmount,
      grandTotal: calculatedGrandTotal,
      validUntil: sanitizeString(validUntil, 20) || '2026-12-31',
      note: sanitizeString(body.note, 500) || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'GST Digital quotation securely validated and dispatched.',
      quotation: createdQuote,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate digital quotation. Invalid payload format.' },
      { status: 500 }
    );
  }
}
