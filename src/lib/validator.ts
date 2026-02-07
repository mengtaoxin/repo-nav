/**
 * Validates if a string is a valid URL
 * @param url - The URL string to validate
 * @returns true if the URL is valid, false otherwise
 */
export function isValidUrl(url: string): boolean {
  if (!url || url.trim() === "") {
    return false;
  }

  try {
    const urlObj = new URL(url);
    // Check if the protocol is http or https
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validates if a string is a valid URL or empty (for optional fields)
 * @param url - The URL string to validate
 * @returns true if the URL is valid or empty, false otherwise
 */
export function isValidUrlOrEmpty(url: string): boolean {
  if (!url || url.trim() === "") {
    return true;
  }
  return isValidUrl(url);
}
