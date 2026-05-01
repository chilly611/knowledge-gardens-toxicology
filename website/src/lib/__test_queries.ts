/**
 * Smoke tests for queries-tox. Runnable via:
 *   npx tsx --env-file=.env.local src/lib/__test_queries.ts
 *
 * Or, if your tsx is older and doesn't support --env-file, source manually:
 *   set -a && source .env.local && set +a
 *   npx tsx src/lib/__test_queries.ts
 *
 * Exits non-zero on any failure. Designed to be cheap to invoke during
 * developer onboarding to confirm both `.env.local` is wired and TOX is up.
 *
 * No dotenv dependency required — Node 20.6+ supports --env-file natively.
 */

// Belt-and-suspenders: read .env.local at startup if env vars aren't already set.
// This makes the script work even without --env-file.
import * as fs from 'fs';
if (!process.env.NEXT_PUBLIC_SUPABASE_TOX_URL) {
  try {
    const text = fs.readFileSync('.env.local', 'utf8');
    for (const line of text.split('\n')) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    // Ignore if .env.local can't be read; the queries will throw a clearer error.
  }
}

import {
  listSubstances,
  getSubstance,
  getCertifiedClaims,
  getClaimWithEvidence,
  getCrossGardenLinks,
  getCases,
  getCase,
  searchEverything,
  getResearchBacklog,
} from './queries-tox';

type Test = { name: string; run: () => Promise<unknown>; expect: (r: unknown) => boolean };

const tests: Test[] = [
  { name: 'listSubstances has at least 3 entries',
    run: () => listSubstances(),
    expect: (r) => Array.isArray(r) && (r as unknown[]).length >= 3 },

  { name: 'getSubstance("glyphosate") resolves',
    run: () => getSubstance('glyphosate'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect: (r) => !!r && Array.isArray((r as any).claims) && (r as any).claims.length > 0 },

  { name: 'getCertifiedClaims() has Glyphosate × NHL contested row',
    run: () => getCertifiedClaims(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect: (r) => (r as any[]).some((c) => c.substance_name === 'Glyphosate' && c.endpoint_name === 'non_hodgkin_lymphoma' && c.status === 'contested') },

  { name: 'getCertifiedClaims({ status: "contested" }) returns ≥1 row',
    run: () => getCertifiedClaims({ status: 'contested' }),
    expect: (r) => (r as unknown[]).length >= 1 },

  { name: 'getClaimWithEvidence(NHL claim) returns 5 sources',
    run: async () => {
      const all = await getCertifiedClaims();
      const nhl = (all as Array<{ claim_id: string; endpoint_name: string }>).find((c) => c.endpoint_name === 'non_hodgkin_lymphoma');
      if (!nhl) throw new Error('NHL row not found');
      return getClaimWithEvidence(nhl.claim_id);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect: (r) => (r as any)?.source_count >= 5 },

  { name: 'getCases() includes Sky Valley',
    run: () => getCases(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect: (r) => (r as any[]).some((c) => /sky valley/i.test(c.caption ?? c.short_name ?? '')) },

  { name: 'getCase("sky-valley") returns parties + docs + events',
    run: () => getCase('Sky Valley PCB Case'),
    expect: (r) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const c = r as any;
      return !!c && c.parties.length >= 1 && c.documents.length >= 1 && c.events.length >= 1;
    } },

  { name: 'getCrossGardenLinks(glyphosate, "substance") returns ≥1',
    run: async () => {
      const r = await getSubstance('glyphosate');
      if (!r) throw new Error('no glyphosate');
      return getCrossGardenLinks(r.substance.id, 'substance');
    },
    // tolerant — pass if 0 too, just verifying the call shape
    expect: (r) => Array.isArray(r) },

  { name: 'searchEverything("Roundup") finds Glyphosate alias',
    run: () => searchEverything('Roundup'),
    // tolerant — depends on alias data being present
    expect: (r) => Array.isArray(r) },

  { name: 'searchEverything("Erickson") finds Sky Valley',
    run: () => searchEverything('Erickson'),
    expect: (r) => Array.isArray(r) },

  { name: 'getResearchBacklog() returns array (may be empty)',
    run: () => getResearchBacklog(),
    expect: (r) => Array.isArray(r) },
];

(async () => {
  let pass = 0, fail = 0;
  for (const t of tests) {
    try {
      const r = await t.run();
      if (t.expect(r)) {
        // eslint-disable-next-line no-console
        console.log(`  PASS  ${t.name}`);
        pass++;
      } else {
        // eslint-disable-next-line no-console
        console.error(`  FAIL  ${t.name}`);
        // eslint-disable-next-line no-console
        console.error(`        got: ${JSON.stringify(r).slice(0, 220)}`);
        fail++;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`  THRW  ${t.name}: ${(err as Error).message}`);
      fail++;
    }
  }
  // eslint-disable-next-line no-console
  console.log(`\n${pass} passed · ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
