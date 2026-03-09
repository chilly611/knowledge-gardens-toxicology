import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About the Toxicology Knowledge Garden — an open, evidence-based platform for understanding contaminants in drinking water.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-4xl font-bold md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
        About This Garden
      </h1>
      <div className="space-y-8" style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', lineHeight: 1.85 }}>
        <p>
          The Toxicology Knowledge Garden is an open, evidence-based platform for understanding
          what&rsquo;s in your drinking water. We bring together data from leading scientific
          and regulatory sources into a single, navigable experience — built for everyone from
          concerned parents to professional researchers.
        </p>
        <section>
          <h2 className="mb-3 text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>What We Cover</h2>
          <p>
            Our database contains 329 substances detected in American drinking water, enriched
            with chemical identifiers, health effect associations, regulatory limits from
            multiple agencies, and real contamination data showing how many people and water
            systems are affected.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Data Sources</h2>
          <div className="space-y-4">
            <Source name="Environmental Working Group (EWG)" url="https://www.ewg.org/tapwater"
              desc="Tap water contamination data — which substances are detected, in how many water systems, and how many people are affected." />
            <Source name="PubChem (NIH)" url="https://pubchem.ncbi.nlm.nih.gov"
              desc="Chemical identifiers including CAS numbers, molecular formulas, SMILES notation, InChI keys, and thousands of synonyms." />
            <Source name="U.S. Environmental Protection Agency (EPA)" url="https://www.epa.gov"
              desc="Federal regulatory limits (Maximum Contaminant Levels), health goals, and toxicity assessments." />
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>How It&rsquo;s Built</h2>
          <p>
            This is a Knowledge Garden — part of the XR Workers ecosystem. The platform is
            powered by a normalized PostgreSQL database with full-text search, fuzzy matching,
            and trade name resolution. Every substance page is statically generated for speed
            and includes structured data (Schema.org JSON-LD) for AI discoverability.
          </p>
          <p className="mt-3">
            The source code is open on{' '}
            <a href="https://github.com/chilly611/knowledge-gardens-toxicology" target="_blank" rel="noopener noreferrer"
               className="text-[var(--color-teal)] underline">GitHub</a>.
            The database is also accessible via REST API and an MCP server for AI agents.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Important Disclaimers</h2>
          <p className="text-[var(--color-ink-light)]" style={{ fontSize: '0.95rem' }}>
            This platform is for educational and informational purposes only. It is not a substitute for professional
            medical or environmental health advice. Health effect associations are based on published research and
            regulatory assessments — evidence levels vary. Always consult qualified professionals for decisions
            about your water quality and health.
          </p>
        </section>
        <section className="rounded-lg border border-[var(--color-teal)]/20 bg-[var(--color-teal)]/5 p-6">
          <h2 className="mb-2 text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>The Knowledge Gardens</h2>
          <p style={{ fontSize: '1rem' }}>
            This toxicology garden is one of several Knowledge Gardens being developed. Each garden takes a complex
            domain — orchids, toxicology, and more to come — and makes it navigable, beautiful, and useful.
            Where science meets wonder.
          </p>
          <p className="mt-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-steel)' }}>
            A project by XR Workers · theknowledgegardens.com
          </p>
        </section>
      </div>
    </div>
  );
}

function Source({ name, url, desc }: { name: string; url: string; desc: string }) {
  return (
    <div className="rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-cream)] p-4">
      <a href={url} target="_blank" rel="noopener noreferrer"
         className="text-lg font-semibold text-[var(--color-teal)] hover:underline"
         style={{ fontFamily: 'var(--font-display)' }}>{name} ↗</a>
      <p className="mt-1 text-sm text-[var(--color-ink-light)]" style={{ lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}
