import {
  getAllSubstances,
  getSubstanceBySlug,
  getSubstanceHealthEffects,
  getSubstanceClassifications,
  getSubstanceRegulations,
  getSubstanceWaterData,
  getSubstanceAliases,
  nameToSlug,
} from '@/lib/supabase';
import type { Metadata } from 'next';
import SubstanceDetail from '@/components/SubstanceDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const substances = await getAllSubstances();
  return substances.map((s) => ({ slug: nameToSlug(s.name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const sub = await getSubstanceBySlug(slug);
    return {
      title: sub.name,
      description: sub.description?.slice(0, 155) || `Toxicology data for ${sub.name}`,
    };
  } catch {
    return { title: 'Substance Not Found' };
  }
}

export default async function SubstancePage({ params }: Props) {
  const { slug } = await params;

  let substance;
  try {
    substance = await getSubstanceBySlug(slug);
  } catch {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          Substance Not Found
        </h1>
        <p className="mt-4 text-[var(--color-steel)]">
          No substance found for &ldquo;{slug}&rdquo;.
        </p>
        <a href="/substances" className="mt-6 inline-block text-[var(--color-teal)]">
          ← Back to all substances
        </a>
      </div>
    );
  }

  const [healthEffects, classifications, regulations, waterData, aliases] =
    await Promise.all([
      getSubstanceHealthEffects(substance.id),
      getSubstanceClassifications(substance.id),
      getSubstanceRegulations(substance.id),
      getSubstanceWaterData(substance.id),
      getSubstanceAliases(substance.id),
    ]);

  return (
    <SubstanceDetail
      substance={substance}
      healthEffects={healthEffects}
      classifications={classifications}
      regulations={regulations}
      waterData={waterData}
      aliases={aliases}
    />
  );
}
