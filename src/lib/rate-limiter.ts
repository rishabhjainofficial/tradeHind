/**
 * TradeHind Anti-Abuse & Rate Limiting Engine
 * Implements sliding-window token bucket algorithm to protect APIs against DoS, brute force & scraper bots.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory rate limiting store (backed by IP / user key)
const ipRateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired records every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of ipRateLimitStore.entries()) {
      if (now > record.resetAt) {
        ipRateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit?: number; // Max requests allowed in window
  windowSeconds?: number; // Window duration in seconds
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  error?: string;
}

/**
 * Checks and increments rate limit for a given identifier (e.g. client IP or User ID)
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit || 20; // default 20 requests
  const windowMs = (options.windowSeconds || 60) * 1000; // default 1 minute
  const now = Date.now();

  const existing = ipRateLimitStore.get(identifier);

  if (!existing || now > existing.resetAt) {
    ipRateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (existing.count >= limit) {
    const resetSeconds = Math.ceil((existing.resetAt - now) / 1000);
    return {
      success: false,
      limit,
      remaining: 0,
      resetSeconds,
      error: `Too many requests. Please try again in ${resetSeconds} seconds.`,
    };
  }

  existing.count += 1;
  const remaining = limit - existing.count;
  const resetSeconds = Math.ceil((existing.resetAt - now) / 1000);

  return {
    success: true,
    limit,
    remaining,
    resetSeconds,
  };
}

/**
 * Known aggressive automated bot & scraper User-Agent signatures
 */
const BOT_USER_AGENTS = [
  'curl',
  'python-requests',
  'aiohttp',
  'scrapy',
  'httpclient',
  'postmanruntime',
  'okhttp',
  'go-http-client',
  'libwww-perl',
  'zgrab',
  'masscan',
  'nikto',
  'nmap',
];

/**
 * Detects if a request is likely from an automated scanner or scraper bot
 */
export function isAutomatedBot(userAgent: string | null | undefined): boolean {
  if (!userAgent || userAgent.trim().length === 0) return true;
  const lower = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => lower.includes(bot));
}

/**
 * Extracts client IP from standard proxy headers (Cloudflare, X-Forwarded-For, etc.)
 */
export function extractClientIp(request: Request): string {
  const headers = request.headers;
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) return xRealIp;

  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  return '127.0.0.1';
}
