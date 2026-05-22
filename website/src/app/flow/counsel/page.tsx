// src/app/flow/counsel/page.tsx
//
// REDIRECT shim for the old query-string URL format.
// Old: /flow/counsel?case=sky-valley
// New: /flow/counsel/sky-valley
//
// Preserves backward compatibility for any old shared/bookmarked links
// while letting the new dynamic route be the canonical SSR surface.
//
// Note: searchParams are available here even though the new dynamic route
// can't see them. We resolve the case, then redirect.

import { redirect } from 'next/navigation';

export default async function CounselFlowRedirect({
  searchParams,
}: {
  searchParams: Promise<{ case?: string }>;
}) {
  const params = await searchParams; // L-023: Promise in Next.js 16

  if (params?.case) {
    redirect(`/flow/counsel/${params.case}`);
  }

  // No case param — redirect to the case picker or homepage
  redirect('/');
}
