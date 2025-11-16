import { Account } from '../types';

/**
 * Generates a PI (Proforma Invoice) ID based on the specified format
 * Format: YY (year) + Account ID + Extra ID (00 if not provided) + MM (month)
 * Example: 25 + 1032 + 00 + 11 = 2510320011
 * 
 * @param accountNumber - The account number (e.g., "1032")
 * @param date - The date for the invoice (used for year and month)
 * @param extraId - Extra identifier (default: "00")
 * @returns Generated PI ID
 */
export function generatePiId(
  accountNumber: string,
  date: Date = new Date(),
  extraId: string = '00'
): string {
  // Get year in YY format
  const year = date.getFullYear().toString().slice(-2);
  
  // Get month in MM format
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  // Ensure account number is a string
  const accNum = String(accountNumber);
  
  // Ensure extra ID is padded to 2 digits
  const extra = String(extraId).padStart(2, '0');
  
  // Combine all parts
  return `${year}${accNum}${extra}${month}`;
}

/**
 * Parses a PI ID to extract its components
 * @param piId - The PI ID to parse
 * @returns Object with parsed components
 */
export function parsePiId(piId: string): {
  year: string;
  accountNumber: string;
  extraId: string;
  month: string;
} | null {
  // Minimum length: YY (2) + account (at least 1) + extra (2) + MM (2) = 7
  if (!piId || piId.length < 7) {
    return null;
  }
  
  const year = piId.slice(0, 2);
  const month = piId.slice(-2);
  const middle = piId.slice(2, -2);
  
  // Extract extra ID (last 2 digits of middle)
  const extraId = middle.slice(-2);
  const accountNumber = middle.slice(0, -2);
  
  return {
    year,
    accountNumber,
    extraId,
    month,
  };
}

/**
 * Validates a PI ID format
 * @param piId - The PI ID to validate
 * @returns true if valid, false otherwise
 */
export function validatePiId(piId: string): boolean {
  const parsed = parsePiId(piId);
  if (!parsed) return false;
  
  // Validate year (00-99)
  const year = parseInt(parsed.year);
  if (isNaN(year) || year < 0 || year > 99) return false;
  
  // Validate month (01-12)
  const month = parseInt(parsed.month);
  if (isNaN(month) || month < 1 || month > 12) return false;
  
  return true;
}

/**
 * Generates the next PI ID in sequence for an account
 * @param lastPiId - The last PI ID generated
 * @param accountNumber - The account number
 * @param date - The date for the new invoice
 * @returns Next PI ID
 */
export function generateNextPiId(
  lastPiId: string | undefined,
  accountNumber: string,
  date: Date = new Date()
): string {
  if (!lastPiId) {
    return generatePiId(accountNumber, date, '00');
  }
  
  const parsed = parsePiId(lastPiId);
  if (!parsed) {
    return generatePiId(accountNumber, date, '00');
  }
  
  // Get current year and month
  const currentYear = date.getFullYear().toString().slice(-2);
  const currentMonth = String(date.getMonth() + 1).padStart(2, '0');
  
  // If year or month changed, reset extra ID to 00
  if (parsed.year !== currentYear || parsed.month !== currentMonth) {
    return generatePiId(accountNumber, date, '00');
  }
  
  // Otherwise increment extra ID
  const nextExtraId = String(parseInt(parsed.extraId) + 1).padStart(2, '0');
  return generatePiId(accountNumber, date, nextExtraId);
}

/**
 * Formats a PI ID with separators for display
 * @param piId - The PI ID to format
 * @returns Formatted PI ID (e.g., "25-1032-00-11")
 */
export function formatPiIdDisplay(piId: string): string {
  const parsed = parsePiId(piId);
  if (!parsed) return piId;
  
  return `${parsed.year}-${parsed.accountNumber}-${parsed.extraId}-${parsed.month}`;
}
