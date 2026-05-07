import type { ReactNode } from 'react';

interface SettingsPanelProps {
  children: ReactNode;
  className?: string;
}

export function SettingsPanel({ children, className = '' }: SettingsPanelProps) {
  return (
    <aside
      className={
        'flex w-full flex-col gap-1.5 rounded-2xl bg-bg-panel/80 p-1.5 shadow-xl ring-1 ring-white/5 backdrop-blur sm:gap-4 sm:p-5 lg:w-[320px] ' +
        className
      }
    >
      {children}
    </aside>
  );
}
