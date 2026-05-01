/**
 * APA-style citation formatting for PDF previews.
 * Converts EvidenceSource to formatted citation strings suitable for print.
 */

import type { EvidenceSource } from '../types-tox';

/**
 * Format an EvidenceSource as an APA-ish citation string.
 * Uses publisher as a stand-in for authors (since schema has no authors column).
 * Returns DOI as a hyperlink if present, else URL.
 * Includes retrieval method footnote for unverified (pending) quotes.
 *
 * Example output:
 * "US EPA. (2020). Glyphosate: Interim Registration Review Decision. https://www.epa.gov/..."
 * "[Retrieved via TKG · Claude-2026-04-30 · pending human verification]"
 */
export function formatCitation(source: EvidenceSource, forPending: boolean = false): string {
  const parts: string[] = [];

  // Publisher as author stand-in
  if (source.publisher) {
    parts.push(source.publisher);
  }

  // Year
  if (source.year) {
    parts.push(`(${source.year})`);
  }

  // Title
  if (source.title) {
    parts.push(source.title);
  }

  // DOI or URL
  if (source.doi) {
    parts.push(`https://doi.org/${source.doi}`);
  } else if (source.url) {
    parts.push(source.url);
  }

  const citation = parts.join('. ').replace(/\.{2,}/g, '.');

  // Append pending verification footnote if this source had a [VERIFY:...] quote
  if (forPending) {
    return `${citation} [Retrieved via TKG · Claude-2026-04-30 · pending human verification]`;
  }

  return citation;
}

/**
 * Format multiple sources grouped by tier into a citation list.
 * Returns an array of formatted strings suitable for a bibliography.
 */
export function formatBibliography(sources: EvidenceSource[]): string[] {
  return sources.map((source) => {
    const hadVerifyMarker = !!(source.quote && /^\[VERIFY:/.test(source.quote.trim()));
    return formatCitation(source, hadVerifyMarker);
  });
}
