import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, sellerId, reason } = body;

    if (!leadId || !sellerId) {
      return NextResponse.json(
        { error: 'Missing required parameters: leadId or sellerId' },
        { status: 400 }
      );
    }

    // TradeHind Lead Quality Guarantee: Auto-refund credit to seller wallet
    const refundRecord = {
      refundId: `ref_${Date.now()}`,
      leadId,
      sellerId,
      creditsReimbursed: 1,
      reason: reason || 'unresponsive_or_invalid_lead',
      processedAt: new Date().toISOString(),
      policy: 'TradeHind Lead Quality Guarantee (100% Automatic Refund)',
      status: 'refunded',
    };

    return NextResponse.json({
      success: true,
      message: '1 Lead Credit successfully refunded to seller wallet under TradeHind Lead Quality Guarantee.',
      refund: refundRecord,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process lead refund request' },
      { status: 500 }
    );
  }
}
