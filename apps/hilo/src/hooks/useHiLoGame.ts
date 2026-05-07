import { useCallback, useMemo, useState } from 'react';
import { loadEmbedConfig, postGameResult } from '@games/shell';
import { shuffledDeck } from '../lib/deck';
import { isWinningPick, probabilityFor } from '../lib/hilo';
import { perPickMultiplier } from '../lib/multiplier';
import type { Card, Direction, GamePhase } from '../types';

export interface RoundResult {
  outcome: 'won' | 'lost';
  stake: number;
  multiplier: number;
  payout: number;
  picksWon: number;
}

export interface UseHiLoGameApi {
  // Embed config
  stake: number;
  currency: string;

  // Reactive state
  phase: GamePhase;
  currentCard: Card | null;
  /** The card most recently drawn from the deck. On a winning pick this
   *  is the same as currentCard (it became the new "current"); on a
   *  losing pick it's the card that ended the round. Cleared at the
   *  start of a fresh round. */
  lastPickedCard: Card | null;
  remainingCount: number;
  picksWon: number;
  currentMultiplier: number;
  potentialPayout: number;
  higherProbability: number;
  lowerProbability: number;
  lastResult: RoundResult | null;

  // Actions
  startRound: () => void;
  pick: (direction: Direction) => void;
  cashOut: () => void;
}

export function useHiLoGame(): UseHiLoGameApi {
  const config = useMemo(() => loadEmbedConfig({ defaultStake: 10 }), []);
  const stake = config.stake;
  const currency = config.currency;

  const [phase, setPhase] = useState<GamePhase>('idle');
  const [deck, setDeck] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [lastPickedCard, setLastPickedCard] = useState<Card | null>(null);
  const [picksWon, setPicksWon] = useState<number>(0);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1);
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);

  const higherProbability = useMemo(() => {
    if (phase !== 'playing' || !currentCard) return 0;
    return probabilityFor('higherOrSame', currentCard.rank, deck);
  }, [phase, currentCard, deck]);

  const lowerProbability = useMemo(() => {
    if (phase !== 'playing' || !currentCard) return 0;
    return probabilityFor('lowerOrSame', currentCard.rank, deck);
  }, [phase, currentCard, deck]);

  const potentialPayout = useMemo(() => {
    if (phase !== 'playing' || picksWon === 0) return 0;
    return stake * currentMultiplier;
  }, [phase, picksWon, stake, currentMultiplier]);

  const startRound = useCallback(() => {
    if (phase !== 'idle') return;
    const fresh = shuffledDeck();
    const first = fresh.pop() ?? null;
    setDeck(fresh);
    setCurrentCard(first);
    setLastPickedCard(null);
    setPicksWon(0);
    setCurrentMultiplier(1);
    setLastResult(null);
    setPhase('playing');
  }, [phase]);

  const pick = useCallback(
    (direction: Direction) => {
      if (phase !== 'playing' || !currentCard) return;
      if (deck.length === 0) return;

      const prob = probabilityFor(direction, currentCard.rank, deck);
      const drawn = deck[deck.length - 1]!;
      const remaining = deck.slice(0, -1);

      const won = isWinningPick(direction, currentCard.rank, drawn.rank);

      if (!won) {
        setDeck(remaining);
        setLastPickedCard(drawn);
        setPhase('lost');
        const result: RoundResult = {
          outcome: 'lost',
          stake,
          multiplier: 0,
          payout: 0,
          picksWon,
        };
        setLastResult(result);
        postGameResult({
          game: 'hilo',
          outcome: 'lost',
          stake,
          multiplier: 0,
          payout: 0,
          currency,
        });
        return;
      }

      const stepMultiplier = perPickMultiplier(prob);
      const nextMultiplier = currentMultiplier * stepMultiplier;
      const nextPicksWon = picksWon + 1;

      setDeck(remaining);
      setCurrentCard(drawn);
      setLastPickedCard(drawn);
      setPicksWon(nextPicksWon);
      setCurrentMultiplier(nextMultiplier);

      // Auto-resolve as a win if the deck is now empty (player has
      // correctly predicted all 51 remaining cards).
      if (remaining.length === 0) {
        const winnings = stake * nextMultiplier;
        setPhase('won');
        const result: RoundResult = {
          outcome: 'won',
          stake,
          multiplier: nextMultiplier,
          payout: winnings,
          picksWon: nextPicksWon,
        };
        setLastResult(result);
        postGameResult({
          game: 'hilo',
          outcome: 'won',
          stake,
          multiplier: nextMultiplier,
          payout: winnings,
          currency,
        });
      }
    },
    [phase, currentCard, deck, stake, currency, currentMultiplier, picksWon],
  );

  const cashOut = useCallback(() => {
    if (phase !== 'playing') return;
    if (picksWon === 0) return;

    const winnings = stake * currentMultiplier;
    setPhase('won');
    const result: RoundResult = {
      outcome: 'won',
      stake,
      multiplier: currentMultiplier,
      payout: winnings,
      picksWon,
    };
    setLastResult(result);
    postGameResult({
      game: 'hilo',
      outcome: 'won',
      stake,
      multiplier: currentMultiplier,
      payout: winnings,
      currency,
    });
  }, [phase, picksWon, stake, currentMultiplier, currency]);

  return {
    stake,
    currency,
    phase,
    currentCard,
    lastPickedCard,
    remainingCount: deck.length,
    picksWon,
    currentMultiplier,
    potentialPayout,
    higherProbability,
    lowerProbability,
    lastResult,
    startRound,
    pick,
    cashOut,
  };
}
