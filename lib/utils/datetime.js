/**
 * Formats the date part of a date input string or Date object to DD.MM.YYYY format.
 * Returns 'N/A' for null/undefined input.
 * Returns 'Invalid Date' for input that cannot be parsed as a valid date.
 * Returns 'Formatting Error' for other unexpected errors.
 *
 * @param {string | number | Date | null | undefined} dateInput - The date value to format. Can be a Date object, timestamp number, or a string parsable by new Date().
 * @returns {string} The formatted date string (DD.MM.YYYY) or an error string ('N/A', 'Invalid Date', 'Formatting Error').
 */
export const formatDate = (dateInput) => {
  // Return 'N/A' if the input is null or undefined
  if (dateInput === null || typeof dateInput === 'undefined') {
    // Consider returning '-' or an empty string if preferred over 'N/A' for UI consistency
    return 'N/A';
  }

  try {
    // Attempt to create a Date object from the input
    const date = new Date(dateInput);

    // Check if the created Date object is valid
    if (isNaN(date.getTime())) {
      // Handle cases where input might be a string that doesn't parse correctly
      // Avoid logging excessive warnings in production for expected invalid inputs if possible
      // console.warn(`formatDate received an invalid date input: ${dateInput}`);
      return 'Invalid Date';
    }

    // Use toLocaleDateString for localized date formatting (DD.MM.YYYY for pl-PL)
    // Specifying options ensures consistency and padding (e.g., 01 instead of 1)
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  } catch (error) {
    // Catch any unexpected errors during date processing
    console.error("Error formatting date:", dateInput, error);
    return 'Formatting Error';
  }
};

export const formatDateTime = (dateInput) => {
  // Return 'N/A' if the input is null or undefined
  if (dateInput === null || typeof dateInput === 'undefined') {
    return 'N/A';
  }

  try {
    // Attempt to create a Date object from the input
    const date = new Date(dateInput);

    // Check if the created Date object is valid
    if (isNaN(date.getTime())) {
      // Handle cases where input might be a string that doesn't parse correctly
      console.warn(`formatDateTime received an invalid date input: ${dateInput}`);
      return 'Invalid Date';
    }

    // Extract date and time components
    const year = date.getFullYear();
    // Pad month, day, hours, minutes, seconds with leading zeros if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Return the formatted string
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  } catch (error) {
    // Catch any unexpected errors during date processing
    console.error("Error formatting date:", dateInput, error);
    return 'Formatting Error';
  }
};