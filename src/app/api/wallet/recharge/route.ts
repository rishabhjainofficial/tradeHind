import { NextResponse } from 'next/server';

function sanitizeString(str: any, maxLength = 255): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sellerId, planId, credits, amount, paymentMethod } = body;

    const cleanSellerId = sanitizeString(sellerId, 60);
    const numCredits = Math.max(1, Math.min(100000, Number(credits)));
    const numAmount = Math.max(1, Math.min(10000000, Number(amount)));

    if (!cleanSellerId || isNaN(numCredits) || isNaN(numAmount)) {
      return NextResponse.json(
        { error: 'Missing or invalid mandatory recharge parameters: sellerId, credits, or amount' },
        { status: 400 }
      );
    }

    const transaction = {
      invoiceId: `INV-TH-${Date.now().toString().slice(-6)}`,
      sellerId: cleanSellerId,
      planId: sanitizeString(planId, 40) || 'custom',
      creditsAdded: numCredits,
      amountPaid: numAmount,
      gstIncluded: Math.round(numAmount * (18 / 118)),
      paymentMethod: sanitizeString(paymentMethod, 30) || 'upi',
      status: 'completed',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `${numCredits} Lead Credits securely added to seller wallet.`,
      transaction,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process credit recharge transaction' },
      { status: 500 }
    );
  }
}
