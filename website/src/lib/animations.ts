'use client';

import { useEffect, useRef, useState, RefObject } from 'react';
import { motion } from '@/styles/tokens';

/**
 * Helper: cubic-bezier easing function for smooth count animations.
 */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * useReducedMotion
 *
 * Detects if the user has enabled `prefers-reduced-motion: reduce` in their OS settings.
 * Returns true if reduced motion is preferred, false otherwise.
 * SSR-safe: returns false on the server.
 *
 * @example
 * const prefersReduced = useReducedMotion();
 * if (!prefersReduced) {
 *   // Play animation
 * }
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // Check initial state
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reduced;
}

/**
 * useViewportReveal
 *
 * Uses IntersectionObserver to detect when an element enters the viewport.
 * Sets revealed=true when the element becomes visible.
 * If useReducedMotion is true, revealed becomes true immediately.
 *
 * @param opts.rootMargin CSS margin string for observer trigger point (default: '0px')
 * @param opts.once If true, stop observing after first reveal (default: true)
 *
 * @returns { ref, revealed }
 *   - ref: RefObject to attach to the element to observe
 *   - revealed: boolean indicating if element has entered viewport
 *
 * @example
 * const { ref, revealed } = useViewportReveal({ once: true });
 * return (
 *   <div ref={ref} style={{ opacity: revealed ? 1 : 0 }}>
 *     Content fades in when visible
 *   </div>
 * );
 */
export function useViewportReveal<T extends HTMLElement = HTMLElement>(opts?: {
  rootMargin?: string;
  once?: boolean;
}): { ref: RefObject<T | null>; revealed: boolean } {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    // If reduced motion, reveal immediately
    if (prefersReduced) {
      setRevealed(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (opts?.once !== false) {
            observer.unobserve(element);
          }
        } else if (opts?.once === false) {
          setRevealed(false);
        }
      },
      { rootMargin: opts?.rootMargin ?? '0px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [prefersReduced, opts?.rootMargin, opts?.once]);

  return { ref, revealed };
}

/**
 * useStaggeredChildren
 *
 * Uses IntersectionObserver to progressively reveal child indices one-by-one.
 * Each child is staggered by stepMs (default: tokens.motion.stagger.childDelay).
 * If useReducedMotion is true, all indices are revealed immediately.
 *
 * @param count Number of children to stagger
 * @param opts.stepMs Delay in milliseconds between child reveals (default: tokens.motion.stagger.childDelay)
 * @param opts.once If true, stop observing after stagger completes (default: true)
 *
 * @returns { ref, indices }
 *   - ref: RefObject to attach to parent container
 *   - indices: Set of child indices that should be revealed
 *
 * @example
 * const { ref, indices } = useStaggeredChildren(5, { stepMs: 100 });
 * return (
 *   <div ref={ref}>
 *     {Array.from({ length: 5 }).map((_, i) => (
 *       <div key={i} style={{ opacity: indices.has(i) ? 1 : 0 }}>
 *         Child {i}
 *       </div>
 *     ))}
 *   </div>
 * );
 */
export function useStaggeredChildren<T extends HTMLElement = HTMLElement>(
  count: number,
  opts?: { stepMs?: number; once?: boolean }
): { ref: RefObject<T | null>; indices: Set<number> } {
  const ref = useRef<T>(null);
  const [indices, setIndices] = useState<Set<number>>(new Set());
  const prefersReduced = useReducedMotion();
  const stepMs = opts?.stepMs ?? motion.stagger.childDelay;

  useEffect(() => {
    // If reduced motion, reveal all immediately
    if (prefersReduced) {
      setIndices(new Set(Array.from({ length: count }, (_, i) => i)));
      return;
    }

    const element = ref.current;
    if (!element) return;

    let timeoutIds: ReturnType<typeof setTimeout>[] = [];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger reveal each child
          for (let i = 0; i < count; i++) {
            const timeoutId = setTimeout(() => {
              setIndices((prev) => new Set([...prev, i]));
            }, i * stepMs);
            timeoutIds.push(timeoutId);
          }

          if (opts?.once !== false) {
            observer.unobserve(element);
          }
        } else if (opts?.once === false) {
          setIndices(new Set());
          timeoutIds.forEach(clearTimeout);
          timeoutIds = [];
        }
      },
      { rootMargin: '0px' }
    );

    observer.observe(element);

    return () => {
      timeoutIds.forEach(clearTimeout);
      observer.disconnect();
    };
  }, [count, stepMs, prefersReduced, opts?.once]);

  return { ref, indices };
}

/**
 * useCountUp
 *
 * Counts from 0 to target over durationMs with easeOutCubic easing.
 * Can trigger on mount or when element enters viewport.
 * If useReducedMotion is true, jumps to target immediately.
 *
 * @param target The target number to count to
 * @param opts.durationMs Animation duration in milliseconds (default: tokens.motion.counter.duration)
 * @param opts.trigger When to start counting: 'mount' (immediately) or 'inview' (when visible, default: 'mount')
 *
 * @returns { ref, value }
 *   - ref: RefObject to attach to the element (required for 'inview' trigger)
 *   - value: Current count value as a number
 *
 * @example
 * // Count on mount
 * const { ref, value } = useCountUp(100, { trigger: 'mount' });
 * return <div ref={ref}>{Math.floor(value)}</div>;
 *
 * @example
 * // Count when visible
 * const { ref, value } = useCountUp(1000, { trigger: 'inview' });
 * return <div ref={ref}>{Math.floor(value)}</div>;
 */
export function useCountUp<T extends HTMLElement = HTMLElement>(
  target: number,
  opts?: { durationMs?: number; trigger?: 'mount' | 'inview' }
): { ref: RefObject<T | null>; value: number } {
  const ref = useRef<T>(null);
  const [value, setValue] = useState(0);
  const prefersReduced = useReducedMotion();
  const durationMs = opts?.durationMs ?? motion.counter.duration;
  const trigger = opts?.trigger ?? 'mount';

  // Handle reduced motion
  useEffect(() => {
    if (prefersReduced) {
      setValue(target);
    }
  }, [prefersReduced, target]);

  // Handle mount trigger
  useEffect(() => {
    if (prefersReduced || trigger !== 'mount') return;

    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeOutCubic(progress);
      setValue(target * eased);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [target, durationMs, prefersReduced, trigger]);

  // Handle inview trigger
  useEffect(() => {
    if (prefersReduced || trigger !== 'inview') return;

    const element = ref.current;
    if (!element) return;

    let animationFrameId: number;
    let hasStarted = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          hasStarted = true;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            const eased = easeOutCubic(progress);
            setValue(target * eased);

            if (progress < 1) {
              animationFrameId = requestAnimationFrame(animate);
            } else {
              setValue(target);
            }
          };

          animationFrameId = requestAnimationFrame(animate);
          observer.unobserve(element);
        }
      },
      { rootMargin: '0px' }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [target, durationMs, prefersReduced, trigger]);

  return { ref, value };
}

/**
 * useTabCrossfade
 *
 * Manages a crossfade animation between tab keys.
 * When activeKey changes, isAnimating becomes true for the duration of the fade.
 * The current key stays at the previous value for half the duration, then swaps to the new key.
 * If useReducedMotion is true, swaps immediately without animation.
 *
 * @param activeKey The currently active tab key
 * @param opts.durationMs Crossfade duration in milliseconds (default: tokens.motion.tabSwitch.duration)
 *
 * @returns { current, isAnimating }
 *   - current: The key to display (previous key during fade, new key after)
 *   - isAnimating: boolean indicating if fade is in progress
 *
 * @example
 * const { current, isAnimating } = useTabCrossfade(activeTab);
 * return (
 *   <div style={{ opacity: isAnimating ? 0.5 : 1 }}>
 *     {renderTabContent(current)}
 *   </div>
 * );
 */
export function useTabCrossfade(
  activeKey: string,
  opts?: { durationMs?: number }
): { current: string; isAnimating: boolean } {
  const [current, setCurrent] = useState(activeKey);
  const [isAnimating, setIsAnimating] = useState(false);
  const prefersReduced = useReducedMotion();
  const durationMs = opts?.durationMs ?? motion.tabSwitch.duration;

  useEffect(() => {
    if (activeKey === current) return;

    if (prefersReduced) {
      // No animation, just swap immediately
      setCurrent(activeKey);
      return;
    }

    // Start animation
    setIsAnimating(true);

    // Swap to new key at half duration
    const swapTimerId = setTimeout(() => {
      setCurrent(activeKey);
    }, durationMs / 2);

    // End animation at full duration
    const endTimerId = setTimeout(() => {
      setIsAnimating(false);
    }, durationMs);

    return () => {
      clearTimeout(swapTimerId);
      clearTimeout(endTimerId);
    };
  }, [activeKey, current, durationMs, prefersReduced]);

  return { current, isAnimating };
}
