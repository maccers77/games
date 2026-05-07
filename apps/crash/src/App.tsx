import { GameShell, Header, PlayArea, SettingsPanel } from '@games/shell';
import { useCrashGame } from './hooks/useCrashGame';
import { BetPanel } from './components/BetPanel';
import { CrashStage } from './components/CrashStage';

function KekeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <rect x="5" y="9" width="14" height="7" rx="2" fill="#facc15" />
      <rect x="7" y="6" width="10" height="4" rx="1.5" fill="#1b2742" />
      <circle cx="8.5" cy="18" r="2.2" fill="#1b2742" />
      <circle cx="15.5" cy="18" r="2.2" fill="#1b2742" />
      <circle cx="8.5" cy="18" r="0.9" fill="#5eead4" />
      <circle cx="15.5" cy="18" r="0.9" fill="#5eead4" />
    </svg>
  );
}

export default function App() {
  const game = useCrashGame();

  return (
    <GameShell
      header={<Header title="Chicken Keke" subtitle="Crash prototype" icon={<KekeIcon />} />}
      settings={
        <SettingsPanel>
          <BetPanel
            phase={game.phase}
            multiplier={game.multiplier}
            stake={game.stake}
            currency={game.currency}
            outcome={game.outcome}
            cashoutMultiplier={game.cashoutMultiplier}
            payout={game.payout}
            onStart={game.startRound}
            onCashOut={game.cashOut}
          />
        </SettingsPanel>
      }
      play={
        <PlayArea>
          <CrashStage phase={game.phase} multiplier={game.multiplier} />
        </PlayArea>
      }
    />
  );
}
