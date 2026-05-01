/**
 * Engineering dimension line — copper-deep dashed segment with end-tick marks
 * and an optional Space Mono label centered on top. Used as decorative
 * vocabulary on substance detail tabs and section frames.
 */
export default function DimensionLine({
  length = 120,
  label,
  vertical = false,
  color = 'var(--copper-orn-deep)',
  className = '',
}: {
  length?: number;
  label?: string;
  vertical?: boolean;
  color?: string;
  className?: string;
}) {
  const stroke = 0.8;
  if (vertical) {
    return (
      <svg
        width="20"
        height={length}
        viewBox={`0 0 20 ${length}`}
        className={className}
        aria-hidden
      >
        <line x1="2"  y1="0" x2="18" y2="0"  stroke={color} strokeWidth={stroke}/>
        <line x1="10" y1="0" x2="10" y2={length} stroke={color} strokeWidth={stroke} strokeDasharray="3 3"/>
        <line x1="2"  y1={length} x2="18" y2={length} stroke={color} strokeWidth={stroke}/>
        {label && (
          <text
            x="10"
            y={length / 2}
            transform={`rotate(-90 10 ${length / 2})`}
            fill={color}
            fontFamily="'Space Mono', monospace"
            fontSize="9"
            textAnchor="middle"
            letterSpacing="1.2"
          >
            {label}
          </text>
        )}
      </svg>
    );
  }
  return (
    <svg
      width={length}
      height="20"
      viewBox={`0 0 ${length} 20`}
      className={className}
      aria-hidden
    >
      <line x1="0"  y1="2"  x2="0"  y2="18" stroke={color} strokeWidth={stroke}/>
      <line x1="0"  y1="10" x2={length} y2="10" stroke={color} strokeWidth={stroke} strokeDasharray="3 3"/>
      <line x1={length} y1="2" x2={length} y2="18" stroke={color} strokeWidth={stroke}/>
      {label && (
        <text
          x={length / 2}
          y="8"
          fill={color}
          fontFamily="'Space Mono', monospace"
          fontSize="9"
          textAnchor="middle"
          letterSpacing="1.2"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
