/**
 * RoleHighlight — reserved for future audience-specific claim commentary.
 * Currently unused; provided for B1 completeness per brief.
 * When E1 enriches claims with role-specific interpretations, this component
 * will surface them beneath the effect_summary in LoomCell.
 */

interface RoleHighlightProps {
  audience: 'consumer' | 'clinician' | 'counsel';
  claimId: string;
}

export default function RoleHighlight({ audience, claimId }: RoleHighlightProps) {
  // Placeholder: will be implemented when role-specific commentary is available
  return null;
}
