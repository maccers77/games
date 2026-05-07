import { type Card as CardType, isRedSuit, rankLabel, suitGlyph } from '../types';

interface CardProps {
  card?: CardType | null;
  faceDown?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * Pip positions for ranks 2..10, expressed as fractions of the inner
 * content area (excluding the corner indices). x is column (0 = left,
 * 1 = right), y is row (0 = top, 1 = bottom). Patterns roughly match
 * the standard French-deck layout but skip pip rotation for a cleaner
 * modern look.
 */
const PIP_LAYOUTS: Record<number, Array<[number, number]>> = {
  2: [
    [0.5, 0.0],
    [0.5, 1.0],
  ],
  3: [
    [0.5, 0.0],
    [0.5, 0.5],
    [0.5, 1.0],
  ],
  4: [
    [0.0, 0.0],
    [1.0, 0.0],
    [0.0, 1.0],
    [1.0, 1.0],
  ],
  5: [
    [0.0, 0.0],
    [1.0, 0.0],
    [0.5, 0.5],
    [0.0, 1.0],
    [1.0, 1.0],
  ],
  6: [
    [0.0, 0.0],
    [1.0, 0.0],
    [0.0, 0.5],
    [1.0, 0.5],
    [0.0, 1.0],
    [1.0, 1.0],
  ],
  7: [
    [0.0, 0.0],
    [1.0, 0.0],
    [0.5, 0.25],
    [0.0, 0.5],
    [1.0, 0.5],
    [0.0, 1.0],
    [1.0, 1.0],
  ],
  8: [
    [0.0, 0.0],
    [1.0, 0.0],
    [0.5, 0.25],
    [0.0, 0.5],
    [1.0, 0.5],
    [0.5, 0.75],
    [0.0, 1.0],
    [1.0, 1.0],
  ],
  9: [
    [0.0, 0.0],
    [1.0, 0.0],
    [0.0, 0.33],
    [1.0, 0.33],
    [0.5, 0.5],
    [0.0, 0.67],
    [1.0, 0.67],
    [0.0, 1.0],
    [1.0, 1.0],
  ],
  10: [
    [0.0, 0.0],
    [1.0, 0.0],
    [0.5, 0.18],
    [0.0, 0.33],
    [1.0, 0.33],
    [0.0, 0.67],
    [1.0, 0.67],
    [0.5, 0.82],
    [0.0, 1.0],
    [1.0, 1.0],
  ],
};

// Card SVG geometry. 250x350 keeps a clean 2.5:3.5 aspect ratio at
// integer coordinates; consumers control the rendered size via CSS.
const W = 250;
const H = 350;
const PAD = 14;
const CONTENT_X = 56;
const CONTENT_Y = 56;
const CONTENT_W = W - CONTENT_X * 2;
const CONTENT_H = H - CONTENT_Y * 2;

export function Card(props: CardProps) {
  const { card, faceDown, className, ariaLabel } = props;

  // Empty slot (no card supplied and not explicitly face-down): render
  // a dashed placeholder so the layout doesn't collapse.
  if (!card && !faceDown) {
    return (
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={className}
        role="img"
        aria-label={ariaLabel ?? 'Empty card slot'}
      >
        <rect
          x={PAD / 2}
          y={PAD / 2}
          width={W - PAD}
          height={H - PAD}
          rx={20}
          ry={20}
          fill="rgba(255, 255, 255, 0.03)"
          stroke="rgba(255, 255, 255, 0.18)"
          strokeWidth={2}
          strokeDasharray="6 6"
        />
      </svg>
    );
  }

  if (faceDown || !card) {
    return (
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`hilo-card ${className ?? ''}`}
        role="img"
        aria-label={ariaLabel ?? 'Face-down card'}
      >
        <defs>
          <linearGradient id="cardback-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <pattern id="cardback-pattern" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="14" height="14" fill="transparent" />
            <path d="M 0 7 L 14 7 M 7 0 L 7 14" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
          </pattern>
        </defs>
        <rect
          x={PAD / 2}
          y={PAD / 2}
          width={W - PAD}
          height={H - PAD}
          rx={20}
          ry={20}
          fill="url(#cardback-bg)"
        />
        <rect
          x={PAD / 2 + 8}
          y={PAD / 2 + 8}
          width={W - PAD - 16}
          height={H - PAD - 16}
          rx={14}
          ry={14}
          fill="url(#cardback-pattern)"
          stroke="rgba(255, 255, 255, 0.18)"
          strokeWidth="1.5"
        />
        <text
          x={W / 2}
          y={H / 2 + 14}
          textAnchor="middle"
          fontFamily="ui-serif, Georgia, serif"
          fontWeight={700}
          fontSize={48}
          fill="rgba(255,255,255,0.5)"
          letterSpacing={2}
        >
          HL
        </text>
      </svg>
    );
  }

  const color = isRedSuit(card.suit) ? '#dc2626' : '#0f172a';
  const label = rankLabel(card.rank);
  const glyph = suitGlyph(card.suit);
  const isFace = card.rank === 11 || card.rank === 12 || card.rank === 13;
  const isAce = card.rank === 14;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`hilo-card ${className ?? ''}`}
      role="img"
      aria-label={ariaLabel ?? `${label} of ${card.suit}`}
    >
      <rect
        x={PAD / 2}
        y={PAD / 2}
        width={W - PAD}
        height={H - PAD}
        rx={20}
        ry={20}
        fill="#fafaf9"
        stroke="rgba(15, 23, 42, 0.18)"
        strokeWidth={1.5}
      />

      {/* Top-left corner index */}
      <g fill={color} fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif">
        <text x={20} y={42} fontSize={32} fontWeight={700} letterSpacing={-1}>
          {label}
        </text>
        <text x={20} y={70} fontSize={24} fontFamily="serif">
          {glyph}
        </text>
      </g>
      {/* Bottom-right corner index (rotated) */}
      <g fill={color} fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif" transform={`rotate(180 ${W - 20} ${H - 42})`}>
        <text x={W - 20} y={H - 42} fontSize={32} fontWeight={700} letterSpacing={-1}>
          {label}
        </text>
        <text x={W - 20} y={H - 70} fontSize={24} fontFamily="serif">
          {glyph}
        </text>
      </g>

      {/* Centre artwork */}
      {isAce ? (
        <text
          x={W / 2}
          y={H / 2 + 30}
          textAnchor="middle"
          fontFamily="serif"
          fontSize={120}
          fill={color}
        >
          {glyph}
        </text>
      ) : isFace ? (
        <g>
          <text
            x={W / 2}
            y={H / 2 + 24}
            textAnchor="middle"
            fontFamily="ui-serif, Georgia, serif"
            fontWeight={700}
            fontSize={92}
            fill={color}
          >
            {label}
          </text>
          <text
            x={W / 2}
            y={H / 2 + 72}
            textAnchor="middle"
            fontFamily="serif"
            fontSize={32}
            fill={color}
            opacity={0.85}
          >
            {glyph}
          </text>
        </g>
      ) : (
        // Pip cluster for 2..10
        <g fill={color} fontFamily="serif">
          {(PIP_LAYOUTS[card.rank] ?? []).map(([fx, fy], i) => (
            <text
              key={i}
              x={CONTENT_X + fx * CONTENT_W}
              y={CONTENT_Y + fy * CONTENT_H + 12}
              textAnchor="middle"
              fontSize={36}
            >
              {glyph}
            </text>
          ))}
        </g>
      )}
    </svg>
  );
}
