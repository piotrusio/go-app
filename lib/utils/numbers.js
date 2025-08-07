/**
 * Formats a numerical value to two decimal places with space as a thousands separator,
 * and appends a given prefix (unit/suffix).
 *
 * @param {number | string} value - The numerical value to format. Can be a number or a string parsable as a number.
 * @param {string} prefix - The string to append after the formatted number (e.g., "MB", "kg", "PLN").
 * @returns {string} The formatted string (e.g., "1 000.10 MB") or 'N/D' if inputs are invalid.
 */
export const formatValueWithPrefix = (value, prefix) => {
  // Validate value
  const numericValue = Number(value);
  if (isNaN(numericValue)) {
    return 'N/D'; // Not a valid number
  }

  // Validate prefix
  if (typeof prefix !== 'string' || prefix.trim() === '') {
    // If prefix is essential and missing/invalid, return 'N/D'
    // If prefix is optional, you might choose to return just the formatted number.
    // Based on the prompt, it seems prefix is expected.
    return 'N/D';
  }

  // Round to 2 decimal places and get string representation
  const fixedValueString = numericValue.toFixed(2); // e.g., 1234.567 -> "1234.57", 1000 -> "1000.00"

  // Split into integer and fractional parts
  const parts = fixedValueString.split('.');
  let integerPart = parts[0];
  const fractionalPart = parts[1]; // This will always be 2 digits due to toFixed(2)

  // Handle potential negative sign for thousands separation
  const sign = integerPart.startsWith('-') ? '-' : '';
  if (sign) {
    integerPart = integerPart.substring(1); // Remove sign before formatting integer part
  }

  // Add space as thousands separator to the integer part
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  // Combine all parts with the prefix
  return `${sign}${formattedIntegerPart}.${fractionalPart} ${prefix.trim()}`;
};