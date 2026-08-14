import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, sellerId, currentCredits } = body;

    if (!leadId || !sellerId) {
      return NextResponse.json(
        { error: 'Missing required parameters leadId or sellerId' },
        { status: 400 }
      );
    }

    if (currentCredits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits balance. Please purchase a credit pack.' },
        { status: 402 }
      );
    }

    // Atomic unlock simulation with timestamp and audit log
    const auditRecord = {
      leadId,
      sellerId,
      creditsDebited: 1,
      unlockedAt: new Date().toISOString(),
      transactionId: `tx_unlock_${Date.now()}`,
      status: 'success',
    };

    return NextResponse.json({
      success: true,
      message: 'BuyLead unlocked successfully. Direct buyer contact revealed.',
      data: auditRecord,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process lead unlock request' },
      { status: 500 }
    );
  }
}
