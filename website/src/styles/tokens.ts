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
  teal:         '#2ea4a3',
  tealDeep:     '#1f7e7d',
  indigo:       '#553278',
  indigoDeep:   '#3d2456',
  crimson:      '#e83759',
  crimsonDeep:  '#b8243f',
  peach:        '#ffb166',
  peachDeep:    '#d68843',
  copper:       '#b87333',
  copperDeep:   '#8a5524',

  /* status semantics */
  certified:    '#2ea4a3',
  provisional:  '#d68843',
  contested:    '#e83759',

  /* audience accents */
  audienceConsumer:  '#2ea4a3',
  audienceClinician: '#553278',
  audienceCounsel:   '#e83759',
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
