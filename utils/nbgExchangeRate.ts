/**
 * Utility for fetching exchange rates from National Bank of Georgia (NBG)
 * API Documentation: https://nbg.gov.ge/en/monetary-policy/currency
 */

export interface NBGExchangeRate {
  code: string; // Currency code (e.g., "USD", "EUR")
  quantity: number; // Quantity of currency
  rateFormated: string; // Formatted rate
  diffFormated: string; // Difference from previous
  rate: number; // Exchange rate
  name: string; // Currency name
  diff: number; // Difference value
  date: string; // Date of rate
  validFromDate: string; // Valid from date
}

/**
 * Fetches exchange rates from NBG for a specific date
 * @param date - Date in YYYY-MM-DD format. If not provided, uses current date
 * @returns Array of exchange rates
 */
export async function fetchNBGExchangeRates(date?: string): Promise<NBGExchangeRate[]> {
  try {
    const dateParam = date || new Date().toISOString().split('T')[0];
    const response = await fetch(`https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/en/json/?date=${dateParam}`);
    
    if (!response.ok) {
      throw new Error(`NBG API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data[0]?.currencies || [];
  } catch (error) {
    console.error('Error fetching NBG exchange rates:', error);
    // Return mock data for development/fallback
    return getMockNBGRates();
  }
}

/**
 * Gets the exchange rate for a specific currency pair
 * @param fromCurrency - Source currency (e.g., "USD")
 * @param toCurrency - Target currency (e.g., "GEL")
 * @param date - Optional date for historical rates
 * @returns Exchange rate
 */
export async function getNBGExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  date?: string
): Promise<number> {
  // GEL is the base currency in NBG
  if (fromCurrency === 'GEL' && toCurrency === 'GEL') {
    return 1;
  }
  
  const rates = await fetchNBGExchangeRates(date);
  
  if (fromCurrency === 'GEL') {
    // Converting from GEL to foreign currency
    const targetRate = rates.find(r => r.code === toCurrency);
    if (targetRate) {
      return 1 / targetRate.rate;
    }
  } else if (toCurrency === 'GEL') {
    // Converting from foreign currency to GEL
    const sourceRate = rates.find(r => r.code === fromCurrency);
    if (sourceRate) {
      return sourceRate.rate;
    }
  } else {
    // Converting between two foreign currencies
    const fromRate = rates.find(r => r.code === fromCurrency);
    const toRate = rates.find(r => r.code === toCurrency);
    if (fromRate && toRate) {
      return fromRate.rate / toRate.rate;
    }
  }
  
  throw new Error(`Exchange rate not found for ${fromCurrency}/${toCurrency}`);
}

/**
 * Mock exchange rates for development/fallback
 */
function getMockNBGRates(): NBGExchangeRate[] {
  return [
    {
      code: 'USD',
      quantity: 1,
      rateFormated: '2.71',
      diffFormated: '0.00',
      rate: 2.71,
      name: 'US Dollar',
      diff: 0,
      date: new Date().toISOString().split('T')[0],
      validFromDate: new Date().toISOString().split('T')[0],
    },
    {
      code: 'EUR',
      quantity: 1,
      rateFormated: '2.95',
      diffFormated: '0.00',
      rate: 2.95,
      name: 'Euro',
      diff: 0,
      date: new Date().toISOString().split('T')[0],
      validFromDate: new Date().toISOString().split('T')[0],
    },
  ];
}

/**
 * Calculates the final price based on base price and exchange rate
 */
export function calculatePriceWithRate(basePrice: number, exchangeRate: number): number {
  return basePrice * exchangeRate;
}
