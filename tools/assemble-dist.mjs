#!/usr/bin/env node
/**
 * Assemble per-app builds into a single deployable dist/ folder.
 *
 *   dist/
 *     index.html        (launcher)
 *     crash/...         (apps/crash/dist)
 *     mines/...         (apps/mines/dist)
 *
 * Pre-requisite: each app must have already been built (each app's vite.config.ts
 * sets a `base` matching its subpath, so emitted asset URLs work after relocation).
 *
 * Run via `pnpm build` (which builds the apps first, then invokes this script).
 */

import { rm, cp, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dist = join(root, 'dist');

/** Add new games here as they're built. */
const apps = [
  {
    slug: 'crash',
    source: 'apps/crash/dist',
    title: 'Chicken Keke',
    blurb: 'Classic crash game prototype. Tap start, watch the multiplier, cash out before the keke crashes.',
  },
  {
    slug: 'mines',
    source: 'apps/mines/dist',
    title: 'Mines',
    blurb: '6x6 board with 6 hidden mines. Reveal safe tiles to grow your multiplier; cash out anytime.',
  },
  {
    slug: 'hilo',
    source: 'apps/hilo/dist',
    title: 'Hi-Lo',
    blurb: 'Predict whether the next card is higher-or-same or lower-or-same. Cash out anytime; one wrong pick ends the round.',
  },
];

const DEFAULT_QS = '?stake=25&currency=NGN';

async function main() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

  for (const app of apps) {
    const src = join(root, app.source);
    if (!existsSync(src)) {
      console.error(`[assemble] missing build output for ${app.slug}: ${src}`);
      process.exit(1);
    }
    await cp(src, join(dist, app.slug), { recursive: true });
    console.log(`[assemble] copied ${app.source} -> dist/${app.slug}/`);
  }

  await writeFile(join(dist, 'index.html'), launcherHtml(), 'utf8');
  console.log(`[assemble] wrote dist/index.html`);
  console.log(`[assemble] dist/ ready (${apps.length} app${apps.length === 1 ? '' : 's'})`);
}

function launcherHtml() {
  const cards = apps
    .map(
      (app) => `      <a class="card" href="/${app.slug}/${DEFAULT_QS}">
        <div class="card-title">${escapeHtml(app.title)}</div>
        <div class="card-blurb">${escapeHtml(app.blurb)}</div>
        <div class="card-cta">Play -&gt;</div>
      </a>`,
    )
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Games \u00B7 prototypes</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0b1020;
      --panel: rgba(255, 255, 255, 0.04);
      --panel-hover: rgba(255, 255, 255, 0.08);
      --ring: rgba(255, 255, 255, 0.08);
      --accent: #5eead4;
      --accent-glow: rgba(94, 234, 212, 0.18);
      --text: #e2e8f0;
      --muted: #94a3b8;
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; }
    body {
      background:
        radial-gradient(circle at 20% 0%, rgba(94, 234, 212, 0.08), transparent 40%),
        radial-gradient(circle at 80% 100%, rgba(250, 204, 21, 0.06), transparent 40%),
        var(--bg);
      color: var(--text);
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      display: grid;
      place-items: center;
      padding: 24px;
    }
    main {
      width: 100%;
      max-width: 720px;
    }
    h1 {
      margin: 0 0 8px;
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 0.01em;
    }
    .lede {
      color: var(--muted);
      margin: 0 0 32px;
      font-size: 14px;
      line-height: 1.6;
    }
    .lede code {
      font-family: ui-monospace, "SF Mono", Menlo, monospace;
      background: var(--panel);
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--text);
    }
    .grid {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    }
    .card {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 18px;
      background: var(--panel);
      border-radius: 16px;
      box-shadow: 0 0 0 1px var(--ring), 0 10px 30px rgba(0, 0, 0, 0.25);
      text-decoration: none;
      color: inherit;
      transition: background 120ms ease, transform 120ms ease, box-shadow 120ms ease;
    }
    .card:hover {
      background: var(--panel-hover);
      transform: translateY(-1px);
      box-shadow: 0 0 0 1px var(--ring), 0 14px 38px rgba(0, 0, 0, 0.3), 0 0 24px var(--accent-glow);
    }
    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text);
    }
    .card-blurb {
      font-size: 13px;
      color: var(--muted);
      line-height: 1.5;
    }
    .card-cta {
      margin-top: auto;
      font-size: 12px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--accent);
    }
    footer {
      margin-top: 32px;
      font-size: 11px;
      color: var(--muted);
      text-align: center;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    footer a { color: var(--accent); text-decoration: none; }
    footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <main>
    <h1>Games &middot; prototypes</h1>
    <p class="lede">
      Standalone embed-only game prototypes. Each game is loaded as an iframe at its own path
      and accepts <code>?stake=</code> and <code>?currency=</code> URL params; on round end it
      posts a <code>game:result</code> message to the parent window. See
      <a href="https://github.com/maccers77/games/blob/main/integration.md">integration.md</a>
      for the full host contract.
    </p>
    <div class="grid">
${cards}
    </div>
    <footer>Prototype &middot; play money only</footer>
  </main>
</body>
</html>
`;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

main().catch((err) => {
  console.error('[assemble] failed:', err);
  process.exit(1);
});
