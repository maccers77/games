# games

A pnpm workspace of standalone gambling game prototypes. Each game lives under `apps/*` as its own Vite + React + TypeScript app and is designed to be embedded in a parent prototype via an `<iframe>`.

> These are **prototypes**, not production code. No real money, no real RNG guarantees, no audit-grade fairness.

## Layout

```
apps/
  mines/        Classic Mines on a 6x6 grid (6 mines, single round)
  crash/        Classic crash game (Chicken Keke), single bet, single round
  hilo/         Hi-Lo card game on one 52-card deck, single round
packages/
  game-shell/   Shared header / settings / play-area shell, embed helpers, Tailwind preset
tools/
  assemble-dist.mjs   Combines per-app builds into a single dist/ for deployment
```

## Requirements

- Node 18.18+ (tested with 20.x)
- pnpm 9.x

## Install & run

```bash
pnpm install
pnpm dev              # all games in one command
pnpm dev:mines        # http://localhost:5173
pnpm dev:crash        # http://localhost:5174
pnpm dev:hilo         # http://localhost:5175
```

For local development you can load the games directly in a browser tab:

- `http://localhost:5174/?stake=25&currency=NGN` (Crash)
- `http://localhost:5173/?stake=25&currency=NGN` (Mines)
- `http://localhost:5175/?stake=25&currency=NGN` (Hi-Lo)

If you load without `?stake`, the iframe falls back to `stake=10, currency=USD` and prints a `console.warn` — handy for iterating on the UI but not a valid production state.

## Build

`pnpm build` produces a single deployable `dist/` directory containing both games and a launcher landing page:

```
dist/
  index.html        Launcher (links to /crash/, /mines/, /hilo/)
  crash/            Built Chicken Keke app, asset URLs prefixed with /crash/
  mines/            Built Mines app, asset URLs prefixed with /mines/
  hilo/             Built Hi-Lo app, asset URLs prefixed with /hilo/
```

```bash
pnpm typecheck        # tsc -b across the workspace
pnpm build            # builds all apps + assembles dist/
pnpm preview          # serve dist/ locally on http://localhost:3000

pnpm build:mines      # build only Mines (apps/mines/dist)
pnpm build:crash      # build only Crash (apps/crash/dist)
pnpm build:hilo       # build only Hi-Lo (apps/hilo/dist)
```

The per-app dev URLs stay at `/`, but production builds set Vite's `base` to `/crash/`, `/mines/`, and `/hilo/` respectively so the assembled artifact is drop-in for any single-domain static host.

## Embedding a game

Each game is an embed-only SPA. The contract is:

- **Parent -> iframe**: pass `?stake=<number>` (and optionally `?currency=<ISO>`) in the URL.
- **Iframe -> parent**: post a single `game:result` message via `window.postMessage` when the round resolves.

```html
<iframe
  src="https://your-host/crash/?stake=25&currency=NGN"
  width="900"
  height="675"
  style="border: 0;"
></iframe>
```

```ts
window.addEventListener('message', (e) => {
  if (e.data?.type !== 'game:result') return;
  // { type: 'game:result', game: 'crash' | 'mines', outcome: 'won' | 'lost',
  //   stake, multiplier, payout, currency }
});
```

Full URL-param table, message schema, per-game semantics, security guidance, and a drop-in TypeScript parent listener live in [integration.md](integration.md).

## Deploying

The repo is wired up for **Cloudflare Pages** with auto-deploy on push to `main`:

1. Sign in to the [Cloudflare dashboard](https://dash.cloudflare.com/) (free tier is enough).
2. **Workers & Pages -> Create application -> Pages -> Connect to Git** and select the GitHub repo.
3. Build settings:
   - **Framework preset**: None
   - **Build command**: `pnpm install --frozen-lockfile && pnpm build`
   - **Build output directory**: `dist`
   - **Root directory**: leave empty
4. Environment variables (Production + Preview):
   - `NODE_VERSION` = `20`
5. Save and Deploy. First build takes ~90 seconds.

Cloudflare assigns a `https://<project>.pages.dev` URL automatically. Subsequent pushes to `main` redeploy automatically; PRs get isolated preview deploys at unique URLs.

[`wrangler.toml`](wrangler.toml) at the repo root declares `pages_build_output_dir = "./dist"` so Cloudflare's deploy step (`npx wrangler deploy`) recognises this as a static Pages project rather than trying to deploy a Worker out of the pnpm workspace root. If you rename the Cloudflare project, update `name` in `wrangler.toml` to match.

The artifact in `dist/` is portable, so swapping to Vercel / Netlify / static S3 later is just a matter of pointing the host at the same build command and output directory.

## Adding a new game

1. Copy `apps/mines` to `apps/<your-game>`.
2. Update `name` in its `package.json` to `@games/<your-game>`.
3. Set `base: command === 'build' ? '/<your-game>/' : '/'` in its `vite.config.ts`.
4. Add `dev:<your-game>` / `build:<your-game>` / `preview:<your-game>` scripts to the root `package.json`.
5. Add the game to the `apps` array in [tools/assemble-dist.mjs](tools/assemble-dist.mjs) so it's included in the unified `dist/` and shows up on the launcher.
6. In your hook, use `loadEmbedConfig` from `@games/shell` to read the stake, and call `postGameResult({ game, outcome, stake, multiplier, payout, currency })` exactly once when the round resolves.
7. Build.

## Continuous integration

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs `pnpm typecheck` and `pnpm build` on every push and pull request, and uploads the assembled `dist/` as a workflow artifact for inspection. Cloudflare Pages does its own build on push, but CI catches base-path / asset breakage before it merges.
