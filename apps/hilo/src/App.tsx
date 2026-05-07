import { GameShell, Header, PlayArea, SettingsPanel } from '@games/shell';
import { useHiLoGame } from './hooks/useHiLoGame';
import { BetPanel } from './components/BetPanel';
import { Stage } from './components/Stage';
import { ChoiceButtons } from './components/ChoiceButtons';
import { HiLoResult } from './components/HiLoResult';

export default function App() {
  const game = useHiLoGame();

  return (
    <GameShell
      header={<Header title="Hi-Lo" subtitle="card prototype" />}
      settings={
        <SettingsPanel>
          <BetPanel
            phase={game.phase}
            stake={game.stake}
            currency={game.currency}
            picksWon={game.picksWon}
            currentMultiplier={game.currentMultiplier}
            potentialPayout={game.potentialPayout}
            lastResult={game.lastResult}
            onStart={game.startRound}
            onCashOut={game.cashOut}
          />
        </SettingsPanel>
      }
      play={
        <PlayArea
          banner={<HiLoResult result={game.lastResult} currency={game.currency} />}
        >
          <div className="flex h-full w-full flex-col items-stretch gap-4">
            <Stage
              currentCard={game.currentCard}
              lastPickedCard={game.lastPickedCard}
              remainingCount={game.remainingCount}
              phase={game.phase}
            />
            <ChoiceButtons
              phase={game.phase}
              higherProbability={game.higherProbability}
              lowerProbability={game.lowerProbability}
              onPick={game.pick}
            />
          </div>
        </PlayArea>
      }
    />
  );
}
