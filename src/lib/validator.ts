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

/**
 * Validates if a string is a valid file system path
 * @param path - The file system path to validate
 * @returns true if the path is valid, false otherwise
 */
export function isValidFileSystemPath(path: string): boolean {
  if (!path || path.trim() === "") {
    return true; // Empty paths are valid (optional field)
  }

  const trimmedPath = path.trim();

  // Check for absolute path
  // Unix/Mac: starts with /
  // Windows: starts with drive letter like C:\ or C:/
  const isUnixAbsolutePath = trimmedPath.startsWith("/");
  const isWindowsAbsolutePath = /^[a-zA-Z]:[/\\]/.test(trimmedPath);

  if (!isUnixAbsolutePath && !isWindowsAbsolutePath) {
    return false;
  }

  // Check for invalid characters
  // Most file systems don't allow: null character, and on some systems: < > : " | ? *
  // But : is valid in Unix paths and \ is valid in Windows paths
  const invalidChars = /[\0]/;
  if (invalidChars.test(trimmedPath)) {
    return false;
  }

  return true;
}
