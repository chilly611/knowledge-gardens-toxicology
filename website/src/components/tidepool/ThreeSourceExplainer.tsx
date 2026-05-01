import { getCertifiedClaims } from '@/lib/queries-tox';
import { statusColor } from '@/styles/tokens';

/**
 * Three-Source-Rule Explainer — server-side data fetch.
 * Finds the Glyphosate × non_hodgkin_lymphoma contested row and renders
 * supporting sources (left/teal) vs contradicting sources (right/crimson).
 * Each source shows publisher, year, and tier badge.
 */
export default async function ThreeSourceExplainer() {
  // Fetch all contested claims
  const contested = await getCertifiedClaims({ status: 'contested' });

  // Find Glyphosate × non_hodgkin_lymphoma row
  const nhlClaim = contested.find(
    (c) =>
      c.substance_name.toLowerCase() === 'glyphosate' &&
      c.endpoint_category.toLowerCase().includes('non_hodgkin') ||
      c.endpoint_name.toLowerCase().includes('non_hodgkin')
  );

  if (!nhlClaim) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--ink-mute)',
          fontFamily: 'var(--font-display)',
        }}
      >
        <p>No contested claims found for Glyphosate × Non-Hodgkin Lymphoma.</p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Check back as the database grows.
        </p>
      </div>
    );
  }

  // Split sources by support
  const supporting = nhlClaim.sources.filter((s) => s.supports);
  const contradicting = nhlClaim.sources.filter((s) => !s.supports);

  return (
    <div className="space-y-8">
      {/* Claim header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '3rem',
        }}
      >
        <h3
          style={{
            fontSize: '1.5rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            color: 'var(--ink)',
            marginBottom: '0.5rem',
          }}
        >
          {nhlClaim.substance_name} × {nhlClaim.endpoint_name}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: 'var(--ink-soft)',
          }}
        >
          {nhlClaim.effect_summary || 'Contested association'}
        </p>
      </div>

      {/* Supporting vs Contradicting grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Supporting sources (left, teal) */}
        <div>
          <h4
            style={{
              fontSize: '1.1rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              color: 'var(--teal)',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid var(--teal)',
            }}
          >
            Supporting Evidence
          </h4>

          <div className="space-y-3">
            {supporting.length === 0 ? (
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  color: 'var(--ink-mute)',
                }}
              >
                No supporting sources
              </p>
            ) : (
              supporting.map((source, idx) => (
                <SourceCard
                  key={idx}
                  source={source}
                  accent="teal"
                />
              ))
            )}
          </div>
        </div>

        {/* Contradicting sources (right, crimson) */}
        <div>
          <h4
            style={{
              fontSize: '1.1rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              color: 'var(--crimson)',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid var(--crimson)',
            }}
          >
            Contradicting Evidence
          </h4>

          <div className="space-y-3">
            {contradicting.length === 0 ? (
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  color: 'var(--ink-mute)',
                }}
              >
                No contradicting sources
              </p>
            ) : (
              contradicting.map((source, idx) => (
                <SourceCard
                  key={idx}
                  source={source}
                  accent="crimson"
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'rgba(46, 164, 163, 0.05)',
          borderRadius: '4px',
          borderLeft: '3px solid var(--teal)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--ink-soft)',
            lineHeight: 1.6,
          }}
        >
          <span style={{ fontWeight: 700 }}>Confidence Score:</span> {(nhlClaim.confidence_score * 100).toFixed(0)}% ·{' '}
          <span style={{ fontWeight: 700 }}>Sources:</span> {nhlClaim.source_count} ·{' '}
          <span style={{ fontWeight: 700 }}>Status:</span>{' '}
          <span
            style={{
              color: statusColor(nhlClaim.status),
              textTransform: 'capitalize',
            }}
          >
            {nhlClaim.status}
          </span>
        </p>
      </div>
    </div>
  );
}

/**
 * SourceCard — displays a single source with publisher, year, tier, and quote.
 */
function SourceCard({
  source,
  accent,
}: {
  source: any;
  accent: 'teal' | 'crimson';
}) {
  const accentColor =
    accent === 'teal' ? 'var(--teal)' : 'var(--crimson)';

  // Map tier to label
  const tierLabels: Record<number, string> = {
    1: 'Regulatory',
    2: 'Systematic Review',
    3: 'Peer-Reviewed',
    4: 'Industry/News',
  };
  const tierLabel = tierLabels[Number(source.tier)] || 'Unknown';

  return (
    <div
      style={{
        padding: '1rem',
        border: `1px solid ${accentColor}`,
        borderRadius: '4px',
        backgroundColor: `${accentColor}08`,
      }}
    >
      {/* Title (italic) */}
      {source.title && (
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '0.95rem',
            color: 'var(--ink)',
            marginBottom: '0.5rem',
            lineHeight: 1.4,
          }}
        >
          {source.title}
        </p>
      )}

      {/* Publisher + Year + Tier */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '0.5rem',
        }}
      >
        {source.publisher && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--ink-soft)',
            }}
          >
            {source.publisher}
          </span>
        )}

        {source.year && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--ink-mute)',
            }}
          >
            {source.year}
          </span>
        )}

        {/* Tier badge */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            padding: '2px 6px',
            backgroundColor: accentColor,
            color: 'var(--paper)',
            borderRadius: '2px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          T{source.tier}
        </span>
      </div>

      {/* Quote (if available) */}
      {source.quote && !source.quote.includes('[VERIFY') && (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--ink-soft)',
            fontStyle: 'italic',
            lineHeight: 1.4,
            marginTop: '0.5rem',
            paddingTop: '0.5rem',
            borderTop: `1px solid ${accentColor}20`,
          }}
        >
          "{source.quote}"
        </p>
      )}

      {source.quote && source.quote.includes('[VERIFY') && (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--ink-mute)',
            marginTop: '0.5rem',
            paddingTop: '0.5rem',
            borderTop: `1px solid ${accentColor}20`,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '2px 4px',
              backgroundColor: 'rgba(255, 177, 102, 0.2)',
              borderRadius: '2px',
              fontSize: '0.7rem',
            }}
          >
            pending verbatim verification
          </span>
        </p>
      )}

      {/* DOI link if available */}
      {source.doi && (
        <a
          href={`https://doi.org/${source.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: accentColor,
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          DOI: {source.doi}
        </a>
      )}
    </div>
  );
}
