import { Card } from './Card';
import { DeckStack } from './DeckStack';
import type { Card as CardType, GamePhase } from '../types';

interface StageProps {
  currentCard: CardType | null;
  lastPickedCard: CardType | null;
  remainingCount: number;
  phase: GamePhase;
}

function cardKey(c: CardType | null, fallback: string): string {
  return c ? `${c.rank}-${c.suit}` : fallback;
}

export function Stage({ currentCard, lastPickedCard, remainingCount, phase }: StageProps) {
  const isIdle = phase === 'idle';
  const isLost = phase === 'lost';
  const isWon = phase === 'won';

  // On a loss the hero card becomes the bust card so the player sees what
  // killed the round. On idle/playing/won it's the current card the player
  // is judging from (or just cashed out on).
  const heroCard = isLost && lastPickedCard ? lastPickedCard : currentCard;

  const heroRing = isLost
    ? 'ring-2 ring-red-400/70 rounded-[20px]'
    : isWon
    ? 'ring-2 ring-emerald-300/60 rounded-[20px]'
    : '';

  return (
    <div className="flex h-full w-full items-center justify-center gap-4 px-2 py-2 sm:gap-8 sm:px-4 sm:py-4">
      <div className="flex flex-col items-center gap-1.5">
        <DeckStack remainingCount={remainingCount} />
        <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
          {remainingCount} left
        </div>
      </div>

      <div
        key={cardKey(heroCard, isIdle ? 'idle' : 'empty')}
        className="hilo-deal-in w-36 sm:w-52 md:w-60"
        style={{ aspectRatio: '5 / 7' }}
      >
        <Card
          card={heroCard}
          faceDown={isIdle}
          className={['h-full w-full', heroRing].join(' ')}
        />
      </div>
    </div>
  );
}
