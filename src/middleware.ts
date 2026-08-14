import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, isAutomatedBot, extractClientIp } from '@/lib/rate-limiter';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply security filters to /api/* routes
  if (pathname.startsWith('/api/')) {
    const userAgent = request.headers.get('user-agent');
    const clientIp = extractClientIp(request);

    // 1. Bot & Malicious Scraper Check on mutating endpoints
    if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
      if (isAutomatedBot(userAgent)) {
        return NextResponse.json(
          {
            error: 'Automated request rejected. Scripted scraping or non-browser bots are blocked by TradeHind Security.',
            threat: 'bot_activity_blocked',
          },
          { status: 403 }
        );
      }
    }

    // 2. Sliding Window Rate Limiting (DoS / Overload Protection)
    // Allows 30 requests per minute per IP for API endpoints
    const rateLimit = checkRateLimit(clientIp, { limit: 30, windowSeconds: 60 });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Too many requests from your IP address to protect server availability.',
          retryAfterSeconds: rateLimit.resetSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetSeconds),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', String(rateLimit.limit));
    response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
