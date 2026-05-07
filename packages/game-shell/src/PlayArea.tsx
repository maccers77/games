import type { ReactNode } from 'react';

interface PlayAreaProps {
  children: ReactNode;
  /** Optional banner overlay (e.g. result, status). Rendered absolutely on top. */
  banner?: ReactNode;
  className?: string;
}

export function PlayArea({ children, banner, className = '' }: PlayAreaProps) {
  return (
    <section
      className={
        'relative flex-1 rounded-2xl bg-bg-panel/60 p-1 shadow-xl ring-1 ring-white/5 backdrop-blur sm:p-4 ' +
        className
      }
    >
      {banner}
      {children}
    </section>
  );
}
