'use client';

/**
 * Circular down-arrow scroll button. Sits at the bottom of major content
 * sections as a continuity hint (see all 3 reference screenshots — Loom,
 * Stratigraph, Tidepool all have one).
 */
export default function ScrollDownButton({
  onClick,
  className = '',
}: {
  onClick?: () => void;
  className?: string;
}) {
  const handleClick = () => {
    if (onClick) onClick();
    else if (typeof window !== 'undefined') {
      window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
    }
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll down"
      className={`flex h-11 w-11 items-center justify-center rounded-full border border-[var(--paper-line)] bg-[var(--paper)] text-[var(--ink-soft)] transition-all hover:-translate-y-0.5 hover:border-[var(--ink-mute)] ${className}`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M7 1V13M7 13L1 7M7 13L13 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
