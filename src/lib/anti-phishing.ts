/**
 * TradeHind Anti-Phishing, Impersonation & Fraud Protection Engine
 * Detects brand spoofing, malicious links, fake GSTIN numbers & disposable domains.
 */

// 1. Reserved Authority & Platform Impersonation Keywords
const IMPERSONATION_PATTERNS = [
  /\btradehind\s*(support|admin|official|team|staff|security|verify|desk|payment)\b/i,
  /\bindiamart\s*(official|team|support)\b/i,
  /\bjustdial\s*(official|support)\b/i,
  /\bgovernment\s*of\s*india\b/i,
  /\bgst\s*(officer|department|inspector|authority|portal\s*official)\b/i,
  /\bincome\s*tax\s*department\b/i,
  /\bbank\s*(official|manager|verification)\b/i,
  /\badmin(istrator)?\b/i,
  /\bverification\s*officer\b/i,
  /\bkyc\s*compliance\s*officer\b/i,
];

// 2. Phishing & Suspicious URL Patterns
const PHISHING_URL_PATTERNS = [
  /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i, // Raw IP address links (e.g. http://192.168.1.1)
  /bit\.ly|tinyurl\.com|cutt\.ly|is\.gd|t\.me\/|rb\.gy|v\.gd/i, // Obfuscated URL shorteners
  /login[-_.]verify|account[-_.]update|kyc[-_.]update|claim[-_.]reward|refund[-_.]verify/i, // Credential harvesting signatures
  /free[-_.]gift|lottery[-_.]winner|earn[-_.]daily[-_.]crypto/i, // Scam patterns
];

// 3. Known Disposable / Temporary Email Domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
  'trashmail.com',
  'dispostable.com',
  'temp-mail.org',
  'sharklasers.com',
  'getairmail.com',
]);

export interface PhishingCheckResult {
  isSafe: boolean;
  threatType?: 'impersonation' | 'phishing_link' | 'disposable_email' | 'invalid_gstin' | 'suspicious_content';
  reason?: string;
}

/**
 * Checks text (company names, product titles, descriptions) for impersonation or authority spoofing
 */
export function checkImpersonation(text: string): PhishingCheckResult {
  if (!text) return { isSafe: true };

  for (const pattern of IMPERSONATION_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isSafe: false,
        threatType: 'impersonation',
        reason: 'Impersonation detected: Usage of reserved platform, bank, or government authority names is strictly prohibited.',
      };
    }
  }

  return { isSafe: true };
}

/**
 * Scans content (RFQs, notes, messages) for phishing links, obfuscated shorteners, or malicious IP domains
 */
export function scanForPhishingLinks(content: string): PhishingCheckResult {
  if (!content) return { isSafe: true };

  for (const pattern of PHISHING_URL_PATTERNS) {
    if (pattern.test(content)) {
      return {
        isSafe: false,
        threatType: 'phishing_link',
        reason: 'Suspicious or unverified external URL detected. Raw IP links and URL shorteners are prohibited on TradeHind for buyer security.',
      };
    }
  }

  return { isSafe: true };
}

/**
 * Validates Indian GSTIN structure (2-digit state code + 10-character PAN + 1 entity + 1 'Z' + 1 checksum)
 */
export function validateGSTINFormat(gstin: string): boolean {
  if (!gstin) return false;
  const clean = gstin.trim().toUpperCase();
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(clean);
}

/**
 * Checks if an email uses a disposable / temporary mailbox service
 */
export function isDisposableEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1].toLowerCase().trim();
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

/**
 * Comprehensive multi-layer safety check for user submissions
 */
export function runComprehensiveSafetyAudit(payload: {
  name?: string;
  email?: string;
  companyName?: string;
  gstin?: string;
  content?: string;
}): PhishingCheckResult {
  // Check company name impersonation
  if (payload.companyName) {
    const compCheck = checkImpersonation(payload.companyName);
    if (!compCheck.isSafe) return compCheck;
  }

  // Check user name impersonation
  if (payload.name) {
    const nameCheck = checkImpersonation(payload.name);
    if (!nameCheck.isSafe) return nameCheck;
  }

  // Check disposable email
  if (payload.email && isDisposableEmail(payload.email)) {
    return {
      isSafe: false,
      threatType: 'disposable_email',
      reason: 'Disposable or temporary email addresses are not permitted. Please provide a verified business or personal email.',
    };
  }

  // Check GSTIN if provided
  if (payload.gstin && payload.gstin.length > 0 && !validateGSTINFormat(payload.gstin)) {
    return {
      isSafe: false,
      threatType: 'invalid_gstin',
      reason: 'Invalid GSTIN format. GSTIN must be a 15-character valid Indian Tax Identification number.',
    };
  }

  // Check phishing links in message body / description
  if (payload.content) {
    const linkCheck = scanForPhishingLinks(payload.content);
    if (!linkCheck.isSafe) return linkCheck;
  }

  return { isSafe: true };
}
