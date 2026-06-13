/**
 * TKG Brand v2 — typed token exports for component code.
 * Mirrors the `:root` block in `src/app/globals.css`. Treat these as the
 * source of truth alongside the CSS — anywhere a component needs a numeric
 * pixel/duration value, prefer importing from here over hard-coding.
 */
export const tokens = {
  /* paper foundation */
  paper:        '#f5f1e8',
  paperWarm:    '#ede6d6',
  paperDeep:    '#e6dec8',
  paperLine:    '#d8cdb1',

  /* ink */
  ink:          '#1a2433',
  inkSoft:      '#3a4458',
  inkMute:      '#6b7388',

  /* jewel-tone accents */
  teal:         '#3C7A8A',
  tealDeep:     '#234C5A',
  indigo:       '#3B4F6B',
  indigoDeep:   '#2A3A50',
  crimson:      '#A53A2D',
  crimsonDeep:  '#6E2419',
  peach:        '#C68A3D',
  peachDeep:    '#8C5E22',
  copper:       '#b87333',
  copperDeep:   '#8a5524',

  /* status semantics */
  certified:    '#3C7A8A',
  provisional:  '#8C5E22',
  contested:    '#A53A2D',

  /* audience accents */
  audienceConsumer:  '#3C7A8A',
  audienceClinician: '#3B4F6B',
  audienceCounsel:   '#A53A2D',
} as const;

export type Token = keyof typeof tokens;

/* Motion tokens — match the brand spec section §3 */
export const motion = {
  reveal:    { duration: 800, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }, // power3.out approx
  hover:     { duration: 200, lift: -2 },                                // px
  tabSwitch: { duration: 400 },
  counter:   { duration: 1400, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' },
  stagger:   { childDelay: 70 }, // ms between siblings on reveal
} as const;

/* Status → color helper */
export function statusColor(status: 'certified' | 'provisional' | 'contested' | string): string {
  if (status === 'certified')   return tokens.certified;
  if (status === 'provisional') return tokens.provisional;
  if (status === 'contested')   return tokens.contested;
  return tokens.inkMute;
}

/* Audience → color helper */
export function audienceColor(audience: 'consumer' | 'clinician' | 'counsel' | string): string {
  if (audience === 'consumer')  return tokens.audienceConsumer;
  if (audience === 'clinician') return tokens.audienceClinician;
  if (audience === 'counsel')   return tokens.audienceCounsel;
  return tokens.inkMute;
}
