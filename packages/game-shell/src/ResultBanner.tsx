import type { ReactNode } from 'react';

export type BannerTone = 'win' | 'loss' | 'info';

interface ResultBannerProps {
  tone: BannerTone;
  children: ReactNode;
  /** Render as a full-width, block-level element instead of an absolute-positioned overlay. */
  inline?: boolean;
  className?: string;
}

const toneStyles: Record<BannerTone, string> = {
  win: 'border-emerald-300/30 bg-emerald-500/10 text-emerald-200 shadow-glow',
  loss: 'border-red-300/30 bg-red-500/10 text-red-200 shadow-glowDanger',
  info: 'border-white/15 bg-white/5 text-slate-100',
};

const overlayLayout =
  'pointer-events-none absolute inset-x-0 top-3 z-20 mx-auto w-fit max-w-[90%] rounded-full border px-4 py-2 text-sm font-medium backdrop-blur animate-bannerIn';

const inlineLayout =
  'block w-full rounded-xl border px-4 py-3 text-center text-base font-semibold backdrop-blur animate-bannerIn';

export function ResultBanner({ tone, children, inline = false, className = '' }: ResultBannerProps) {
  return (
    <div
      className={
        (inline ? inlineLayout : overlayLayout) +
        ' ' +
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
