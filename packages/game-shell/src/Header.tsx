import type { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  /** Optional icon node, rendered inside the small badge to the left of the title. */
  icon?: ReactNode;
  /** Right-aligned slot, e.g. status indicators or a stake readout. */
  children?: ReactNode;
}

export function Header({ title, subtitle, icon, children }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-bg-tile shadow-glow ring-1 ring-accent/30">
          {icon ?? <DefaultIcon />}
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-slate-100">{title}</div>
          {subtitle ? (
            <div className="text-[11px] uppercase tracking-wider text-slate-500">
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>

      {children ? <div className="flex items-center gap-2">{children}</div> : null}
    </header>
  );
}

function DefaultIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 2.5 19.5 9 12 21.5 4.5 9 12 2.5Z"
        fill="#5eead4"
        stroke="#ecfeff"
        strokeOpacity=".5"
        strokeWidth="0.6"
      />
    </svg>
  );
}
