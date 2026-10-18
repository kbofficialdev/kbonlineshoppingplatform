/**
 * Image Validation & SSRF Prevention Helper
 * Validates uploaded base64 data and external image URLs before saving to PostgreSQL.
 */

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  sanitizedUrl?: string;
  mimeType?: string;
}

// Disallowed private / loopback IP subnets and AWS metadata addresses for SSRF prevention
const PRIVATE_IP_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^169\.254\./, // AWS instance metadata
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
];

/**
 * Validate an external image URL entered by an administrator.
 * Prevents SSRF attacks and ensures safe remote image references.
 */
export function validateImageUrl(urlStr: string): ImageValidationResult {
  if (!urlStr || typeof urlStr !== 'string') {
    return { valid: false, error: 'Image URL is required' };
  }

  const trimmed = urlStr.trim();

  try {
    const parsed = new URL(trimmed);

    // Only allow HTTP and HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, error: 'Only HTTP and HTTPS image URLs are supported' };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check against SSRF private network / loopback patterns
    for (const pattern of PRIVATE_IP_PATTERNS) {
      if (pattern.test(hostname)) {
        return { valid: false, error: 'Access to private internal network or metadata addresses is prohibited (SSRF prevention)' };
      }
    }

    return {
      valid: true,
      sanitizedUrl: parsed.href,
      mimeType: 'image/jpeg',
    };
  } catch (e) {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validate uploaded image payload (Base64 data URL)
 */
export function validateImageDataPayload(dataPayload: string): ImageValidationResult {
  if (!dataPayload || typeof dataPayload !== 'string') {
    return { valid: false, error: 'Image payload is required' };
  }

  // If it's an HTTP/HTTPS URL, validate via validateImageUrl
  if (dataPayload.startsWith('http://') || dataPayload.startsWith('https://')) {
    return validateImageUrl(dataPayload);
  }

  // If Data URL
  if (dataPayload.startsWith('data:')) {
    const match = dataPayload.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    if (!match) {
      // Check for raw SVG
      if (dataPayload.startsWith('data:image/svg+xml')) {
        return { valid: true, sanitizedUrl: dataPayload, mimeType: 'image/svg+xml' };
      }
      return { valid: false, error: 'Invalid Data URL encoding format' };
    }

    const mime = match[1].toLowerCase();
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

    if (!allowedMimes.includes(mime)) {
      return { valid: false, error: `Unsupported image MIME type: ${mime}. Allowed: JPG, PNG, WEBP, GIF, SVG.` };
    }

    // Check size limit: ~5MB in base64 is ~6.8MB chars
    if (dataPayload.length > 7 * 1024 * 1024) {
      return { valid: false, error: 'Image size exceeds maximum limit of 5MB' };
    }

    return { valid: true, sanitizedUrl: dataPayload, mimeType: mime };
  }

  return { valid: false, error: 'Unsupported image format. Must be an HTTP/HTTPS URL or Data URL.' };
}

