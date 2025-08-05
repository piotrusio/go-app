// --- Helper Functions for Avatar ---

/**
 * Extracts the first two characters of a string for initials.
 * @param {string | null | undefined} reference - The string to get initials from.
 * @returns {string} Uppercase initials (max 2 chars) or empty string.
 */
export const getInitials = (reference) => {
  if (!reference) return '';
  return reference.slice(0, 2).toUpperCase();
};

/**
 * Generates consistent background and text color Tailwind classes based on a string hash.
 * @param {string | null | undefined} str - The string to generate color from (e.g., customer reference).
 * @returns {string} Tailwind classes for background and text color.
 */
export const generateAvatarColorClasses = (str) => {
  if (!str) return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100'; // Default grey

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Tailwind color pairs
  const colors = [
    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
    'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-100',
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
    'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100',
    'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100',
    'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100',
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
    'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100',
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-100',
    'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
    'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100',
  ];

  // Use modulo to pick a color from the list based on the hash
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};