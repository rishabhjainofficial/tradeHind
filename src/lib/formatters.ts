/**
 * TradeHind Centralized Formatting & Display Utilities (DRY Principle)
 * Consolidates repeated currency, phone, WhatsApp URL & text formatting.
 */

/**
 * Formats a number to Indian Rupee (INR) currency format (e.g. 50000 -> "₹50,000")
 */
export function formatINR(amount?: number | null, fallback = '₹0'): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return fallback;
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/**
 * Cleans a phone number string to purely numeric digits for telephony/WhatsApp protocols
 */
export function cleanPhoneNumber(phone?: string | null): string {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Builds a valid, safe WhatsApp direct chat URL with pre-filled message
 */
export function buildWhatsAppUrl(phone: string, message = ''): string {
  const clean = cleanPhoneNumber(phone);
  if (!clean) return '#';
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${clean}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
}

/**
 * Trims and limits string length to prevent memory bloat and injection
 */
export function sanitizeString(str: any, maxLength = 255): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

/**
 * Converts slugified strings to Title Case (e.g. "new-delhi" -> "New Delhi")
 */
export function slugToTitleCase(slug: string): string {
  if (!slug) return '';
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
