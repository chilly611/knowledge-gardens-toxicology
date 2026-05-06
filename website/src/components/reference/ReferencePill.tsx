'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { getReferenceTerm } from '@/lib/queries-tox';
import type { ReferenceTerm } from '@/lib/types-tox';

const tooltipCache = new Map<string, string>();

export function ReferencePill({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const loadTooltip = useCallback(async () => {
    if (tooltipCache.has(slug)) {
      setTooltip(tooltipCache.get(slug)!);
      return;
    }
    setLoading(true);
    try {
      const term = await getReferenceTerm(slug);
      if (term) {
        tooltipCache.set(slug, term.short_definition);
        setTooltip(term.short_definition);
      }
    } catch (e) {
      console.error('Failed to load tooltip:', e);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const handleMouseEnter = () => {
    loadTooltip();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      window.location.href = `/reference/${slug}`;
    } else if (e.key === 'Escape' && tooltip) {
      setTooltip(null);
    }
  };

  const handleTouchStart = () => {
    if (!tooltip) {
      loadTooltip();
    } else {
      window.location.href = `/reference/${slug}`;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setTooltip(null);
      }
    };
    if (tooltip) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [tooltip]);

  return (
    <span className="relative inline-block">
      <span
        ref={triggerRef}
        className="inline-block px-1 cursor-pointer transition-colors"
        style={{
          borderBottom: `2px solid var(--copper-orn-deep)`,
          textDecoration: 'none',
        }}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        title={`Click to learn more about ${children}`}
      >
        {children}
      </span>

      {tooltip && (
        <div
          ref={tooltipRef}
          className="absolute left-0 mt-2 bg-white border border-gray-300 rounded shadow-lg p-3 z-50 max-w-xs"
          style={{
            borderLeftColor: 'var(--copper-orn-deep)',
            borderLeftWidth: '3px',
          }}
        >
          <p className="text-sm text-gray-800">{tooltip}</p>
          <p className="text-xs text-gray-500 mt-2">
            Click for full definition or press Enter
          </p>
          <Link href={`/reference/${slug}`}>
            <a className="inline-block mt-2 text-xs text-blue-600 hover:underline">
              Read more →
            </a>
          </Link>
        </div>
      )}

      {loading && tooltip === null && (
        <div className="absolute left-0 mt-2 bg-white border border-gray-300 rounded shadow-lg p-2 z-50">
          <p className="text-xs text-gray-500">Loading...</p>
        </div>
      )}
    </span>
  );
}
