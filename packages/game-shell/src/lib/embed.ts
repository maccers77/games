const DEFAULT_STAKE = 10;
const DEFAULT_CURRENCY = 'USD';

export interface EmbedConfig {
  stake: number;
  currency: string;
  /** True when stake came from URL (production); false when using the dev fallback. */
  urlProvided: boolean;
}

export interface LoadEmbedOptions {
  /** Dev fallback used when ?stake is missing. */
  defaultStake?: number;
  /** Currency fallback used when ?currency is missing. */
  defaultCurrency?: string;
}

function readUrlParam(name: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(name);
}

function parsePositive(raw: string | null): number | null {
  if (raw === null) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function loadEmbedConfig(opts: LoadEmbedOptions = {}): EmbedConfig {
  const stakeFromUrl = parsePositive(readUrlParam('stake'));
  const currencyFromUrl = readUrlParam('currency');
  const fallbackStake = opts.defaultStake ?? DEFAULT_STAKE;
  const fallbackCurrency = opts.defaultCurrency ?? DEFAULT_CURRENCY;

  if (stakeFromUrl === null && typeof console !== 'undefined') {
    console.warn(
      `[games/shell] No ?stake URL param; falling back to ${fallbackStake}. ` +
        `In production the parent iframe must supply ?stake=<amount>.`,
    );
  }

  return {
    stake: stakeFromUrl ?? fallbackStake,
    currency: currencyFromUrl ?? fallbackCurrency,
    urlProvided: stakeFromUrl !== null,
  };
}
