/**
 * Utility functions for formatting numbers in the UI
 */

/**
 * Formats points for display with decimal precision for k values
 * Examples:
 * - 1500 -> "1.5k"
 * - 1250 -> "1.25k" 
 * - 1000 -> "1k"
 * - 999 -> "999"
 * - 2300 -> "2.3k"
 * - 12500 -> "12.5k"
 */
export const formatPoints = (points: number): string => {
  if (points < 1000) {
    return points.toString();
  }
  
  const thousands = points / 1000;
  
  // If it's a whole number of thousands, show without decimal
  if (thousands % 1 === 0) {
    return `${thousands}k`;
  }
  
  // For decimal values, show up to 2 decimal places and remove trailing zeros
  const formatted = thousands.toFixed(2);
  const withoutTrailingZeros = formatted.replace(/\.?0+$/, '');
  
  return `${withoutTrailingZeros}k`;
};

/**
 * Alternative compact number formatting for larger values
 * Handles millions as well
 */
export const formatCompactNumber = (num: number): string => {
  if (num < 1000) {
    return num.toString();
  }
  
  if (num < 1000000) {
    const thousands = num / 1000;
    if (thousands % 1 === 0) {
      return `${thousands}k`;
    }
    const formatted = thousands.toFixed(2);
    const withoutTrailingZeros = formatted.replace(/\.?0+$/, '');
    return `${withoutTrailingZeros}k`;
  }
  
  const millions = num / 1000000;
  if (millions % 1 === 0) {
    return `${millions}M`;
  }
  const formatted = millions.toFixed(2);
  const withoutTrailingZeros = formatted.replace(/\.?0+$/, '');
  return `${withoutTrailingZeros}M`;
};
