import { GameShell, Header, PlayArea, SettingsPanel } from '@games/shell';
import { useMinesGame } from './hooks/useMinesGame';
import { BetPanel } from './components/BetPanel';
import { Grid } from './components/Grid';

export default function App() {
  const game = useMinesGame();

  return (
    <GameShell
      header={<Header title="Mines" subtitle="6 × 6 prototype" />}
      settings={
        <SettingsPanel>
          <BetPanel
            phase={game.phase}
            stake={game.stake}
            currency={game.currency}
            safeRevealed={game.safeRevealed}
            currentMultiplier={game.currentMultiplier}
            nextMultiplierValue={game.nextMultiplierValue}
            potentialPayout={game.potentialPayout}
            lastResult={game.lastResult}
            onStart={game.startRound}
            onCashOut={game.cashOut}
          />
        </SettingsPanel>
      }
      play={
        <PlayArea>
          <Grid board={game.board} phase={game.phase} onReveal={game.revealTile} />
        </PlayArea>
      }
    />
  );
}
