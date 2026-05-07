# Integrating a game iframe

> **Live deployment**: `https://<cloudflare-pages-project>.pages.dev` — replace with the real URL once the Cloudflare Pages project is provisioned (see the "Deploying" section of the [README](README.md)).

Each game in this repo is a standalone SPA designed to be embedded inside a parent prototype via an `<iframe>`. The integration contract is intentionally minimal:

1. **Parent -> iframe**: stake (and optionally currency) passed via URL query params.
2. **Iframe -> parent**: a single `game:result` message posted via `window.postMessage` once the round resolves.

The iframe owns the entire round lifecycle — animation, multiplier, cash-out timing, win/loss outcome — and reports back exactly one summary message. The parent owns balance, eligibility, and what to do next (e.g. credit the user, reload the iframe with new params for another round).

## Lifecycle

```mermaid
sequenceDiagram
  participant Parent as Parent app
  participant Frame as Game iframe

  Parent->>Frame: load <iframe src="...?stake=25&currency=NGN">
  Note over Frame: Round is idle; CTA shows "Start round - <stake>"
  Note over Frame: Player taps Start, plays through, eventually cashes out OR loses
  Frame-->>Parent: postMessage { type: 'game:result', ... }
  Note over Parent: Credit/debit, decide next step
  Parent->>Frame: (optional) reload with new ?stake=... for another round
```

The iframe sends the `game:result` message **exactly once** per page lifecycle. After that the UI is intentionally inert — there is no "play again" button. To run another round the parent reloads the iframe (typically with new URL params).

## Embedding

```html
<iframe
  src="https://your-host/crash/?stake=25&currency=NGN"
  width="900"
  height="675"
  style="border: 0; aspect-ratio: 4 / 3;"
  allow="autoplay"
></iframe>
```

The play surface inside the iframe locks itself to a 171:128 aspect ratio; the iframe element itself can be any size — the game scales fluidly to fit. A 4:3 frame is a good default.

### URL parameters

| Param      | Type   | Required | Default | Notes                                                                |
| ---------- | ------ | -------- | ------- | -------------------------------------------------------------------- |
| `stake`    | number | yes\*    | `10`    | Stake amount in major units (e.g. `25` for ₦25.00). Must be > 0.     |
| `currency` | string | no       | `USD`   | ISO 4217 currency code. Drives `narrowSymbol` formatting (₦, $, €). |

\* `stake` is technically optional for local development - if missing, the iframe falls back to `10` and prints a `console.warn`. In production the parent **must** supply a stake; treat the warning as a contract failure.

There is no balance, mines count, or other configuration to pass. Stake is the only knob.

## Receiving the result

```ts
window.addEventListener('message', (event) => {
  // Always validate origin in production - see "Security" below
  if (event.data?.type !== 'game:result') return;

  const result = event.data;
  console.log(result);
  // {
  //   type: 'game:result',
  //   game: 'crash',
  //   outcome: 'won',
  //   stake: 25,
  //   multiplier: 1.42,
  //   payout: 35.5,
  //   currency: 'NGN'
  // }
});
```

### Message schema

```ts
interface GameResultEvent {
  type: 'game:result';
  /** Identifies which game produced the result. Currently 'crash' or 'mines'. */
  game: 'crash' | 'mines' | string;
  outcome: 'won' | 'lost';
  /** Stake the round was played with, in major units, matches the URL param. */
  stake: number;
  /** Multiplier the round resolved on. See per-game notes below. */
  multiplier: number;
  /** Amount credited to the player. Always 0 on a loss. */
  payout: number;
  /** ISO 4217 currency code, matches the URL param. */
  currency: string;
}
```

Invariants the parent can rely on:

- `payout === 0` whenever `outcome === 'lost'`.
- `payout === stake * multiplier` whenever `outcome === 'won'`.
- The message fires exactly once per iframe page lifecycle.
- Numeric fields are always finite numbers — no `NaN`, no string fallbacks.

### Per-game semantics

The contract is uniform across games but `multiplier` means slightly different things:

| Game  | On win                                                     | On loss                                |
| ----- | ---------------------------------------------------------- | -------------------------------------- |
| Crash | The multiplier captured at the moment Cash out was tapped. | The crash point (where the round died). |
| Mines | Multiplier corresponding to the number of safe tiles revealed at cash-out. | `0` — by definition the player walked away with nothing. |

In practice a parent that just cares about credit/debit can treat the contract uniformly: if `outcome === 'won'` credit `payout`; otherwise nothing changes (the stake was never actually moved by the iframe).

## Reference parent integration (TypeScript)

A drop-in TypeScript snippet you can paste into a host app:

```ts
type GameResultEvent = {
  type: 'game:result';
  game: 'crash' | 'mines';
  outcome: 'won' | 'lost';
  stake: number;
  multiplier: number;
  payout: number;
  currency: string;
};

const TRUSTED_ORIGIN = 'https://your-games-host.example.com';

function listenForGameResult(onResult: (r: GameResultEvent) => void) {
  const handler = (event: MessageEvent) => {
    if (event.origin !== TRUSTED_ORIGIN) return;
    const data = event.data as Partial<GameResultEvent> | undefined;
    if (data?.type !== 'game:result') return;
    if (data.outcome !== 'won' && data.outcome !== 'lost') return;
    onResult(data as GameResultEvent);
  };
  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
}

// usage
const stop = listenForGameResult((r) => {
  if (r.outcome === 'won') creditUser(r.payout, r.currency);
  unlockNextRoundButton();
});
```

## Security

**Heads-up**: in this prototype the iframe currently posts to `'*'` (any parent origin). That's fine for local development and for embedding inside a host you control, but for a hardened production deployment you should:

1. **Constrain the post target** in [packages/game-shell/src/lib/host.ts](packages/game-shell/src/lib/host.ts) so the iframe only posts to a known parent origin (e.g. accept a `?parentOrigin=` URL param and use it as the second argument to `postMessage`).
2. **Validate `event.origin`** in the parent listener (the example above does this) before trusting any payload.
3. **Validate the payload shape** before dispatching - never assume keys exist.
4. Treat `payout` as advisory display; the source of truth for crediting should still be your backend, not a value the iframe asserted.

If you want, the next iteration can add a `?parentOrigin=` flow so step 1 is built in - say the word.

## Sandbox / dev quick-test

To smoke-test the contract without a parent app, open the game directly and paste this into DevTools:

```js
window.addEventListener('message', (e) => {
  if (e.data?.type === 'game:result') console.log('result:', e.data);
});
```

Then play through a round. (When the iframe is the top-level page, `window.parent === window`, so it ends up posting to itself — a convenient way to inspect the contract end-to-end.)

URLs to try:

- `http://localhost:5174/?stake=25&currency=NGN` (Crash)
- `http://localhost:5173/?stake=25&currency=NGN` (Mines)
