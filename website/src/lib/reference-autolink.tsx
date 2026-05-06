import React from 'react';
import { ReferencePill } from '@/components/reference/ReferencePill';

export function autolinkReferences(
  text: string,
  terms: Array<{ slug: string; aliases: string[] }>
): React.ReactNode {
  if (!text || !terms.length) return text;

  // Sort by alias length descending (longest first, avoid partial matches)
  const sortedTerms = terms
    .flatMap((t) => t.aliases.map((alias) => ({ alias, slug: t.slug })))
    .sort((a, b) => b.alias.length - a.alias.length);

  const parts: React.ReactNode[] = [];
  let remaining = text;
  const linkedAliases = new Set<string>();

  // Split by common delimiters to find paragraphs
  const paragraphs = remaining.split(/(?=\n|<[ap])/);

  let partIdx = 0;
  for (const para of paragraphs) {
    let current = para;
    let offset = 0;

    // Skip if inside tags
    if (para.match(/^<[^>]+>/)) {
      parts.push(para);
      continue;
    }

    for (const { alias, slug } of sortedTerms) {
      // Skip if already linked in this paragraph
      if (linkedAliases.has(alias)) continue;

      // Case-sensitive for acronyms (IARC, EPA, ATSDR)
      let pattern: RegExp;
      if (/^[A-Z]{2,}$/.test(alias)) {
        // Acronym: exact case match
        pattern = new RegExp(`\\b${escapeRegex(alias)}\\b`);
      } else {
        // Full name: case-insensitive
        pattern = new RegExp(`\\b${escapeRegex(alias)}\\b`, 'i');
      }

      const match = current.match(pattern);
      if (!match) continue;

      // Don't link if inside <a> or <code> tags
      const before = current.slice(0, match.index!);
      const openTags = (before.match(/<[ap]>/g) || []).length;
      const closeTags = (before.match(/<\/[ap]>/g) || []).length;
      if (openTags > closeTags) continue;

      const codeTags = (before.match(/<code>/g) || []).length;
      const codeCloseTags = (before.match(/<\/code>/g) || []).length;
      if (codeTags > codeCloseTags) continue;

      // Link only the first occurrence per paragraph
      const idx = match.index!;
      const beforeMatch = current.slice(0, idx);
      const matchedText = match[0];
      const afterMatch = current.slice(idx + matchedText.length);

      parts.push(beforeMatch);
      parts.push(
        <ReferencePill key={`pill-${slug}-${partIdx}`} slug={slug}>
          {matchedText}
        </ReferencePill>
      );
      linkedAliases.add(alias);
      current = afterMatch;
      break; // Only one link per paragraph
    }

    parts.push(current);
    partIdx++;
  }

  return <>{parts}</>;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
