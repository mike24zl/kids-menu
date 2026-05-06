export const LIMITS = {
  MAX_FOODS_PER_TYPE: 50,
  MAX_KIDS: 8,
  MAX_DISH_NAME_LENGTH: 50,
  MAX_KID_NAME_LENGTH: 30,
  MAX_IMAGE_URL_LENGTH: 500,
}

// Strip HTML/script tags to prevent injection into the DOM
export function sanitizeText(str) {
  return str.replace(/<[^>]*>/g, '').replace(/[^\S ]+/g, ' ')
}

// Image URLs must be https:// — blocks javascript: URIs and other dangerous schemes
export function isValidImageUrl(url) {
  if (!url) return true
  if (url.length > LIMITS.MAX_IMAGE_URL_LENGTH) return false
  try {
    const u = new URL(url)
    return u.protocol === 'https:'
  } catch {
    return false
  }
}
