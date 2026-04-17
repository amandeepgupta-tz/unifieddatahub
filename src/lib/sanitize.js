/**
 * Input Sanitization Utilities
 * Provides functions to sanitize user inputs and prevent injection attacks
 */

/**
 * Sanitize string input by trimming whitespace and removing potentially dangerous characters
 * @param {string} input - The raw input string
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized string
 */
export const sanitizeString = (input, options = {}) => {
  if (typeof input !== 'string') {
    return '';
  }

  const {
    trim = true,
    maxLength = null,
    allowSpecialChars = false,
  } = options;

  let sanitized = input;

  // Trim whitespace
  if (trim) {
    sanitized = sanitized.trim();
  }

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove control characters (except newline and tab if needed)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // Remove potentially dangerous characters if not allowed
  if (!allowSpecialChars) {
    // Keep only alphanumeric, spaces, and basic punctuation
    sanitized = sanitized.replace(/[^\w\s@._-]/gi, '');
  }

  // Enforce max length
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
};

/**
 * Sanitize username input
 * @param {string} username - Raw username input
 * @returns {string} Sanitized username
 */
export const sanitizeUsername = (username) => {
  return sanitizeString(username, {
    trim: true,
    maxLength: 50,
    allowSpecialChars: false,
  });
};

/**
 * Sanitize password input (less aggressive than username)
 * @param {string} password - Raw password input
 * @returns {string} Sanitized password
 */
export const sanitizePassword = (password) => {
  if (typeof password !== 'string') {
    return '';
  }

  // Only trim and remove null bytes for passwords
  // Don't remove special characters as they're valid in passwords
  return password.trim().replace(/\0/g, '');
};

/**
 * Sanitize credentials object
 * @param {Object} credentials - Raw credentials
 * @returns {Object} Sanitized credentials
 */
export const sanitizeCredentials = (credentials) => {
  return {
    username: sanitizeUsername(credentials.username || ''),
    password: sanitizePassword(credentials.password || ''),
  };
};

/**
 * Validate HTTPS connection in production
 * @returns {Object} Validation result with status and message
 */
export const validateSecureConnection = () => {
  // Skip check in development
  if (import.meta.env.DEV) {
    return {
      isSecure: true,
      message: 'Development mode - HTTPS check skipped',
    };
  }

  const isHTTPS = window.location.protocol === 'https:';

  return {
    isSecure: isHTTPS,
    message: isHTTPS
      ? 'Secure HTTPS connection'
      : 'WARNING: Insecure HTTP connection detected. Please use HTTPS.',
  };
};
