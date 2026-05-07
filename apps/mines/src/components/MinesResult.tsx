import { ResultBanner, formatCurrency } from '@games/shell';
import type { RoundResult } from '../hooks/useMinesGame';

interface MinesResultProps {
  result: RoundResult | null;
  currency: string;
  inline?: boolean;
}

export function MinesResult({ result, currency, inline = false }: MinesResultProps) {
  if (!result) return null;
  if (result.outcome === 'won') {
    return (
      <ResultBanner tone="win" inline={inline}>
        Cashed out
        <span className="mx-1.5 font-mono text-base">{result.multiplier.toFixed(2)}x</span>
        <span className="text-emerald-100">+{formatCurrency(result.delta, currency)}</span>
      </ResultBanner>
    );
  }
  return (
    <ResultBanner tone="loss" inline={inline}>
      Hit a mine ·{' '}
      <span className="text-red-100">−{formatCurrency(result.bet, currency)}</span>
    </ResultBanner>
  );
}
