import { Currency } from '../types';

// Mock exchange rates - in production, fetch from an API
const EXCHANGE_RATES: Record<string, number> = {
  'USD-GEL': 2.65, // 1 USD = 2.65 GEL
  'GEL-USD': 0.38, // 1 GEL = 0.38 USD
  'USD-EUR': 0.92, // 1 USD = 0.92 EUR
  'EUR-USD': 1.09, // 1 EUR = 1.09 USD
  'GEL-EUR': 0.35, // 1 GEL = 0.35 EUR
  'EUR-GEL': 2.88, // 1 EUR = 2.88 GEL
};

export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const rateKey = `${fromCurrency}-${toCurrency}`;
  const rate = EXCHANGE_RATES[rateKey];

  if (!rate) {
    console.warn(`No exchange rate found for ${rateKey}, returning original amount`);
    return amount;
  }

  return amount * rate;
}

export function getCurrencySymbol(currency: Currency): string {
  switch (currency) {
    case 'USD':
      return '$';
    case 'GEL':
      return '₾';
    case 'EUR':
      return '€';
    default:
      return currency;
  }
}

export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
