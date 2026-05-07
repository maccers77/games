const FORMATTERS = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: string): Intl.NumberFormat {
  let f = FORMATTERS.get(currency);
  if (!f) {
    try {
      f = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        currencyDisplay: 'narrowSymbol',
        maximumFractionDigits: 2,
      });
    } catch {
      f = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
    }
    FORMATTERS.set(currency, f);
  }
  return f;
}

export function formatCurrency(amount: number, currency: string): string {
  return getFormatter(currency).format(amount);
}
