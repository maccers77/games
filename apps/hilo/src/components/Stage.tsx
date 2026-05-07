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
  const showBust = isLost && lastPickedCard !== null;

  return (
    <div className="flex h-full w-full items-center justify-center gap-3 px-2 py-2 sm:gap-6 sm:px-4 sm:py-4">
      <div className="flex flex-col items-center gap-1.5">
        <DeckStack remainingCount={remainingCount} />
        <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
          {remainingCount} left
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div
          key={cardKey(currentCard, 'idle')}
          className="hilo-deal-in w-32 sm:w-44 md:w-52"
          style={{ aspectRatio: '5 / 7' }}
        >
          <Card
            card={currentCard}
            faceDown={isIdle}
            className={[
              'h-full w-full',
              isWon ? 'ring-2 ring-emerald-300/60 rounded-[20px]' : '',
            ].join(' ')}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <div
          className="w-20 sm:w-28"
          style={{ aspectRatio: '5 / 7' }}
        >
          {showBust ? (
            <div
              key={cardKey(lastPickedCard, 'bust')}
              className="hilo-deal-in h-full w-full ring-2 ring-red-400/70 rounded-[20px]"
            >
              <Card card={lastPickedCard} className="h-full w-full" />
            </div>
          ) : (
            <Card />
          )}
        </div>
        <div
          className={
            'font-mono text-[10px] uppercase tracking-wider ' +
            (showBust ? 'text-red-300' : 'text-slate-400')
          }
        >
          {showBust ? 'Bust card' : 'Discard'}
        </div>
      </div>
    </div>
  );
}
