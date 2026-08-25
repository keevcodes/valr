/**
 * Format an amount for display
 *
 */
export function formatAmount(amount: number, currency: string): string {
  const formatted = amount.toFixed(2);

  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    ZAR: 'R',
    JPY: '¥',
    BTC: '₿',
    ETH: 'Ξ',
  };

  const symbol = symbols[currency] || currency + ' ';

  return `${symbol}${formatted}`;
}

/**
 * Calculate total with fee
 *
 */
export function calculateTotal(amount: number, feePercent: number): {total: number, fee: number} {
  const fee = (amount * feePercent) / 100;

  return {
    fee,
    total: amount + fee
  };
}

/**
 * Parse amount from string input
 *
 */
export function parseAmount(value: string): number {
  return parseFloat(value);
}

/**
 * Format amount for API (converts to smallest unit)
 *
 */
export function toSmallestUnit(amount: number, _currency: string): number {
  return Math.round(amount * 100);
}

/**
 * Format amount from API (converts from smallest unit)
 *
 */
export function fromSmallestUnit(amount: number, _currency: string): number {
  return amount / 100;
}
