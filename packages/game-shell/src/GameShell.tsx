import type { ReactNode } from 'react';

interface GameShellProps {
  header: ReactNode;
  settings: ReactNode;
  play: ReactNode;
  /** Optional footer caption. Defaults to a "prototype" disclaimer. */
  footer?: ReactNode;
}

export function GameShell({ header, settings, play, footer }: GameShellProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-1.5 px-1.5 py-1.5 sm:gap-5 sm:px-6 sm:py-6">
      {header}
      <main className="flex flex-1 flex-col-reverse gap-1.5 lg:flex-row lg:items-start lg:gap-5">
        {settings}
        {play}
      </main>
      <footer className="text-center text-[11px] uppercase tracking-wider text-slate-600">
        {footer ?? 'Prototype \u00B7 play money only'}
      </footer>
    </div>
  );
}
