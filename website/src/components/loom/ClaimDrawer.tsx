'use client';

import { useEffect } from 'react';
import { slug, quoteOrPending, groupSourcesByTier } from '@/lib/queries-tox';
import { statusColor } from '@/styles/tokens';
import type { CertifiedClaimRow } from '@/lib/types-tox';

interface ClaimDrawerProps {
  claim: CertifiedClaimRow;
  onClose: () => void;
}

export default function ClaimDrawer({ claim, onClose }: ClaimDrawerProps) {
  // Close on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const bgColor = statusColor(claim.status);
  const confidencePercent = Math.round(claim.confidence_score * 100);
  const sourcesByTier = groupSourcesByTier(claim.sources);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 z-50 h-screen w-full max-w-md overflow-y-auto bg-[var(--paper)] shadow-lg transition-transform duration-300 sm:max-w-sm"
        style={{
          transform: 'translateX(0)',
          boxShadow: '-4px 0 16px rgba(26, 36, 51, 0.1)',
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 border-b border-[var(--paper-line)] bg-[var(--paper-warm)] p-6"
          style={{ backgroundColor: bgColor, color: 'white' }}
        >
          <button
            onClick={onClose}
            className="mb-4 inline-flex items-center justify-center rounded p-1 hover:bg-white/20"
            aria-label="Close drawer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <h2
            className="mb-2 text-lg font-semibold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {claim.substance_name}
          </h2>
          <div
            className="font-eyebrow mb-3 text-white/90"
            style={{ opacity: 0.9 }}
          >
            {claim.endpoint_name}
          </div>

          <div className="inline-flex items-center gap-2 rounded bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
            {claim.status}
            <span style={{ fontSize: '0.8rem' }}>({confidencePercent}%)</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Summary */}
          {claim.effect_summary && (
            <div className="mb-6">
              <div className="font-eyebrow mb-2">Effect Summary</div>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--ink)' }}>
                {claim.effect_summary}
              </p>
            </div>
          )}

          {/* Details */}
          <div className="mb-6 grid gap-3 text-sm">
            {claim.population && (
              <div>
                <div className="font-eyebrow">Population</div>
                <div style={{ color: 'var(--ink-soft)' }}>{claim.population}</div>
              </div>
            )}
            {claim.exposure_route && (
              <div>
                <div className="font-eyebrow">Exposure Route</div>
                <div style={{ color: 'var(--ink-soft)' }}>{claim.exposure_route}</div>
              </div>
            )}
            {claim.effect_direction && (
              <div>
                <div className="font-eyebrow">Effect Direction</div>
                <div style={{ color: 'var(--ink-soft)' }}>
                  {claim.effect_direction.replace(/_/g, ' ')}
                </div>
              </div>
            )}
            {claim.effect_magnitude && (
              <div>
                <div className="font-eyebrow">Magnitude</div>
                <div style={{ color: 'var(--ink-soft)' }}>{claim.effect_magnitude}</div>
              </div>
            )}
          </div>

          {/* Sources */}
          <div className="mb-6">
            <div className="font-eyebrow mb-3">Sources ({claim.source_count})</div>
            <div className="space-y-4">
              {([1, 2, 3, 4] as const).map((tier) =>
                sourcesByTier[tier].length > 0 && (
                  <div key={tier}>
                    <div
                      className="font-data mb-2 text-xs uppercase text-[var(--ink-mute)]"
                      style={{ opacity: 0.8 }}
                    >
                      Tier {tier}
                      {tier === 1 && ' · Regulatory'}
                      {tier === 2 && ' · Systematic Review'}
                      {tier === 3 && ' · Peer-Reviewed'}
                      {tier === 4 && ' · Industry/News'}
                    </div>
                    <div className="space-y-2">
                      {sourcesByTier[tier].map((source) => {
                        const quoteInfo = quoteOrPending(source.quote);
                        return (
                          <div
                            key={source.doi || source.url}
                            className="rounded border border-[var(--paper-line)] bg-[var(--paper-warm)] p-3"
                          >
                            {source.title && (
                              <div
                                className="mb-1 text-xs font-semibold"
                                style={{
                                  color: 'var(--ink)',
                                  fontFamily: 'var(--font-display)',
                                }}
                              >
                                {source.title}
                              </div>
                            )}

                            {/* Quote or pending badge */}
                            {quoteInfo.text && (
                              <div
                                className={`mb-2 italic text-xs ${
                                  quoteInfo.verified
                                    ? ''
                                    : 'rounded bg-[var(--paper-deep)] px-2 py-1'
                                }`}
                                style={{
                                  color: quoteInfo.verified
                                    ? 'var(--ink-soft)'
                                    : 'var(--ink-mute)',
                                  fontSize: '0.8rem',
                                  fontStyle: quoteInfo.verified ? 'italic' : 'normal',
                                }}
                              >
                                {quoteInfo.verified ? `"${quoteInfo.text}"` : quoteInfo.text}
                              </div>
                            )}

                            <div className="flex items-center justify-between text-xs">
                              <span
                                style={{
                                  color: 'var(--ink-mute)',
                                  fontFamily: 'var(--font-mono)',
                                }}
                              >
                                {source.supports ? 'Supports' : 'Contradicts'}
                              </span>
                              {source.year && (
                                <span
                                  style={{
                                    color: 'var(--ink-mute)',
                                    fontFamily: 'var(--font-mono)',
                                  }}
                                >
                                  {source.year}
                                </span>
                              )}
                            </div>

                            {source.url && (
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-block text-xs underline"
                                style={{ color: 'var(--teal)' }}
                              >
                                View source →
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Substance detail link */}
          <a
            href={`/compound/${slug(claim.substance_name)}`}
            className="inline-flex items-center gap-1 font-semibold text-[var(--teal)] transition-colors hover:text-[var(--teal-deep)]"
            style={{ fontSize: '0.95rem' }}
          >
            View substance →
          </a>
        </div>
      </div>
    </>
  );
}
