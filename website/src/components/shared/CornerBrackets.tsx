/**
 * Copper corner brackets — wraps any element with the four engineering
 * tick marks the brand spec borrows from the orchid species-experience.
 *
 *   <CornerBrackets>
 *     <ClaimCard ... />
 *   </CornerBrackets>
 */
import { ReactNode } from 'react';

export default function CornerBrackets({
  children,
  size = 16,
  thickness = 1.2,
  color = 'var(--copper-orn)',
  inset = 0,
  className = '',
}: {
  children: ReactNode;
  size?: number;
  thickness?: number;
  color?: string;
  inset?: number;
  className?: string;
}) {
  const off = inset;
  const corner = (rotation: number, x: string, y: string) => (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        top: y === 'top' ? off : undefined,
        bottom: y === 'bottom' ? off : undefined,
        left: x === 'left' ? off : undefined,
        right: x === 'right' ? off : undefined,
        width: size,
        height: size,
        borderTop: `${thickness}px solid ${color}`,
        borderLeft: `${thickness}px solid ${color}`,
        transform: `rotate(${rotation}deg)`,
      }}
    />
  );
  return (
    <div className={`relative ${className}`}>
      {corner(0,   'left',  'top')}
      {corner(90,  'right', 'top')}
      {corner(270, 'left',  'bottom')}
      {corner(180, 'right', 'bottom')}
      {children}
    </div>
  );
}
