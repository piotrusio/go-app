/**
 * Truncates a text string to a specified maximum length and adds ellipsis if truncated.
 * 
 * @param {string} text - The text string to truncate
 * @param {number} maxLength - The maximum allowed length (must be a positive number)
 * @returns {string} The truncated text with "..." appended if it exceeds maxLength, 
 *                   or the original text if within limits, or empty string if input is invalid
 */
export const truncateText = (text, maxLength) => {
  // Return an empty string if the input is null, undefined, or empty
  if (!text) {
    return '';
  }

  // Return original string if maxLength is not provided or invalid
  if (typeof maxLength !== 'number' || maxLength <= 0) {
    console.warn('truncateCompanyName: maxLength must be a positive number.');
    return text;
  }

  // Check if the string length exceeds the maximum length
  if (text.length > maxLength) {
    // Slice the string to the max length and add ellipsis
    return text.slice(0, maxLength) + '...';
  }

  // Return the original string if it's within the limit
  return text;
};