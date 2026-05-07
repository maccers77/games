# Crash assets

Drop assets into this folder and they'll be served at `/assets/...`.

## Expected files (rename to match — or tell me what you used and I'll rewire)

- `keke.svg` — the tuk-tuk vector
- `chicken.png` — the chicken passenger sprite (positioned over the keke seat)
- `background/01-sky.png` — furthest layer (slowest)
- `background/02-...png` — far-distance layer (mountains, etc.)
- `background/03-...png` — mid layer
- `background/04-...png` — near layer
- `background/05-road.png` — foreground road (fastest)

The numeric prefix sets z-order (low = back). Layer assignment lives in
`apps/crash/src/lib/assetLayers.ts` — update there if your filenames or
layer count differs.

While these are missing, the app falls back to placeholder gradient layers
so you can still see the parallax and tuk-tuk in motion.
