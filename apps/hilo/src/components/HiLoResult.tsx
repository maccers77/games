import { ResultBanner, formatCurrency } from '@games/shell';
import type { RoundResult } from '../hooks/useHiLoGame';

interface HiLoResultProps {
  result: RoundResult | null;
  currency: string;
  inline?: boolean;
}

export function HiLoResult({ result, currency, inline = false }: HiLoResultProps) {
  if (!result) return null;
  if (result.outcome === 'won') {
    const profit = result.payout - result.stake;
    return (
      <ResultBanner tone="win" inline={inline}>
        Cashed out
        <span className="mx-1.5 font-mono text-base">{result.multiplier.toFixed(2)}x</span>
        <span className="text-emerald-100">+{formatCurrency(profit, currency)}</span>
      </ResultBanner>
    );
  }
  return (
    <ResultBanner tone="loss" inline={inline}>
      Bust ·{' '}
      <span className="text-red-100">−{formatCurrency(result.stake, currency)}</span>
    </ResultBanner>
  );
}
