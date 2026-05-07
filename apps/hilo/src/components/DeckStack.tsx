import { Card } from './Card';

interface DeckStackProps {
  remainingCount: number;
}

/**
 * A small layered stack of face-down cards used to imply the deck on
 * stage. The number of stacked cards in the visualisation grows in
 * coarse steps with the actual remainingCount; each layer is a real
 * Card SVG so the visual stays sharp at any size.
 */
export function DeckStack({ remainingCount }: DeckStackProps) {
  const layers = stackLayers(remainingCount);

  return (
    <div className="relative w-20 sm:w-28" style={{ aspectRatio: '5 / 7' }}>
      {layers === 0 ? (
        <div className="absolute inset-0">
          <Card />
        </div>
      ) : (
        Array.from({ length: layers }).map((_, i) => {
          const offset = (layers - 1 - i) * 2;
          return (
            <div
              key={i}
              className="absolute inset-0"
              style={{ transform: `translate(${offset}px, ${-offset}px)` }}
            >
              <Card faceDown className="h-full w-full" />
            </div>
          );
        })
      )}
    </div>
  );
}

function stackLayers(remaining: number): number {
  if (remaining <= 0) return 0;
  if (remaining <= 4) return 1;
  if (remaining <= 12) return 2;
  if (remaining <= 24) return 3;
  return 4;
}
