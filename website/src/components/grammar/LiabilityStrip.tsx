/**
 * LiabilityStrip — sitewide poison-control + not-medical-advice CTA per
 * brief §2.9. Every page that touches dose-response or first-aid info needs
 * this visible (not buried). Site-wide is the safest implementation.
 */
export default function LiabilityStrip() {
  return (
    <aside
      className="border-t border-[var(--paper-line)]"
      style={{ background: 'var(--tox-pale)' }}
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-3 sm:flex-row sm:px-6 lg:px-8">
        <div
          className="text-center text-[var(--tox-deep)] sm:text-left"
          style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', lineHeight: 1.4 }}
        >
          <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Not medical advice
          </strong>
          {' — '}
          for any actual exposure or poisoning, call <strong>Poison Control 1-800-222-1222</strong> (US) or your local emergency line.
        </div>
        <a
          href="tel:18002221222"
          className="flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-1.5 transition-transform hover:-translate-y-0.5"
          style={{
            background: 'var(--tox-deep)',
            color: 'var(--paper)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          📞 1-800-222-1222
        </a>
      </div>
    </aside>
  );
}
