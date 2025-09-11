// utils/validation.ts

/**
 * Validates if an email is genuine and professional
 * Blocks fake emails, gibberish, single letters, and repeated characters
 */
export function isValidGenuineEmail(email: string): boolean {
  if (!email) return false;

  // Basic email format validation
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(email)) return false;

  const [localPart, domain] = email.split("@");

  // Reject single letters (a@domain.com)
  if (localPart.length === 1) return false;

  // Reject emails with repeated characters only (aaaa@domain.com)
  if (/^(.)\1+$/.test(localPart)) return false;

  // Reject common dummy/fake domains
  const invalidDomains = [
    "email.com",
    "abc.com",
    "test.com",
    "example.com",
    "dummy.com",
    "fake.com",
    "noemail.com",
    "nomail.com",
    "temp.com",
  ];

  const lowerDomain = domain.toLowerCase();
  if (invalidDomains.includes(lowerDomain)) return false;

  // Reject domains that are variations of common fake patterns
  const suspiciousDomainPatterns = [
    /^(no)?email\d*\.(com|net|org)$/i,
    /^(abc|test|dummy)\d*\.(com|net|org)$/i,
    /^temp\d*\.(com|net|org)$/i,
  ];

  if (suspiciousDomainPatterns.some((pattern) => pattern.test(lowerDomain))) {
    return false;
  }

  // Reject common keyboard gibberish patterns
  const gibberishPatterns = [
    /qwer?t?y?/i,
    /asdf/i,
    /zxcv/i,
    /qweqwe/i,
    /asdfasdf/i,
    /zxcvzxcv/i,
    /123123/i,
    /abcabc/i,
    /testtest/i,
    /^(.{1,3})\1+$/i, // patterns like "abcabc", "123123"
  ];

  const emailLower = email.toLowerCase();
  if (gibberishPatterns.some((pattern) => pattern.test(emailLower))) {
    return false;
  }

  // Reject if local part is too short or all numbers
  if (localPart.length < 3 || /^\d+$/.test(localPart)) return false;

  return true;
}

/**
 * Validates if a name is genuine (first name, last name)
 */
export function isValidName(name: string): boolean {
  if (!name) return false;

  const trimmed = name.trim();
  if (trimmed.length < 2) return false;

  // Allow letters, spaces, hyphens, and apostrophes only
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) return false;

  // Reject repeated characters (aaaa, bbbb, etc.)
  if (/^(.)\1+$/.test(trimmed)) return false;

  return true;
}

/**
 * Validates if organization name is genuine
 */
export function isValidOrgName(orgName: string): boolean {
  if (!orgName) return false;

  const trimmed = orgName.trim();
  if (trimmed.length < 2) return false;

  // Reject single letters or repeated characters
  if (/^(.)\1+$/.test(trimmed)) return false;

  return true;
}

/**
 * Validates phone number format
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;

  // Basic phone validation - adjust regex as needed for your requirements
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}
