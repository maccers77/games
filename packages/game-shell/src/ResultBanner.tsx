import type { ReactNode } from 'react';

export type BannerTone = 'win' | 'loss' | 'info';

interface ResultBannerProps {
  tone: BannerTone;
  children: ReactNode;
  className?: string;
}

const toneStyles: Record<BannerTone, string> = {
  win: 'border-emerald-300/30 bg-emerald-500/10 text-emerald-200 shadow-glow',
  loss: 'border-red-300/30 bg-red-500/10 text-red-200 shadow-glowDanger',
  info: 'border-white/15 bg-white/5 text-slate-100',
};

export function ResultBanner({ tone, children, className = '' }: ResultBannerProps) {
  return (
    <div
      className={
        'pointer-events-none absolute inset-x-0 top-3 z-20 mx-auto w-fit max-w-[90%] rounded-full border px-4 py-2 text-sm font-medium backdrop-blur animate-bannerIn ' +
        toneStyles[tone] +
        ' ' +
        className
      }
      role="status"
      aria-live="polite"
    >
      {children}
    </div>
  );
}
