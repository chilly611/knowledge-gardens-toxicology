/**
 * The seven stages every Knowledge Garden inherits (brief §1.2 / §2.5).
 * For Toxicology specifically, these are the verbs locked in §2.5.
 *
 * BKG analog: size up · lock it in · plan it out · build · adapt · collect · reflect
 * TKG verbs:  identify · assess · plan · act · adapt · resolve · reflect
 *
 * Every garden uses the same skeleton; only the verbs and workflows differ.
 * That is the "brothers and sisters" rule.
 */
export type StageId = 'identify' | 'assess' | 'plan' | 'act' | 'adapt' | 'resolve' | 'reflect';

export type Stage = {
  id: StageId;
  number: number;       // 1..7
  label: string;        // lowercase Cormorant in the chrome
  caption: string;      // sentence-case partner-facing description
  /** ASCII / unicode icon glyph used in StageStepper + TimeMachine. */
  glyph: string;
};

export const STAGES: Stage[] = [
  { id: 'identify', number: 1, label: 'identify', caption: 'What is this substance?',           glyph: '◎' },
  { id: 'assess',   number: 2, label: 'assess',   caption: 'How dangerous, in this scenario?',  glyph: '◇' },
  { id: 'plan',     number: 3, label: 'plan',     caption: 'What do we do about it?',           glyph: '△' },
  { id: 'act',      number: 4, label: 'act',      caption: 'Execute response or daily handling',glyph: '⌘' },
  { id: 'adapt',    number: 5, label: 'adapt',    caption: 'Conditions changed',                glyph: '↻' },
  { id: 'resolve',  number: 6, label: 'resolve',  caption: 'Wrap up the incident or program',   glyph: '◉' },
  { id: 'reflect',  number: 7, label: 'reflect',  caption: 'Learn from it',                     glyph: '☐' },
];

export const STAGE_BY_ID: Record<StageId, Stage> = STAGES.reduce(
  (acc, s) => ({ ...acc, [s.id]: s }),
  {} as Record<StageId, Stage>
);

/** Workflows under each stage (brief §2.5). v1 MVP: Stage 01, four workflows, only Compound Lookup is wired. */
export const WORKFLOWS_BY_STAGE: Record<StageId, { slug: string; title: string; status: 'live' | 'soon' }[]> = {
  identify: [
    { slug: 'compound-lookup',  title: 'Compound lookup',  status: 'live' },
    { slug: 'ghs-classifier',   title: 'GHS classifier',   status: 'soon' },
    { slug: 'label-decoder',    title: 'Label decoder',    status: 'soon' },
    { slug: 'sds-retrieval',    title: 'SDS retrieval',    status: 'soon' },
  ],
  assess: [
    { slug: 'exposure-scenario', title: 'Exposure scenario builder', status: 'soon' },
    { slug: 'dose-calculator',   title: 'Dose calculator',           status: 'soon' },
    { slug: 'risk-score',        title: 'Risk score',                status: 'soon' },
    { slug: 'population-vulnerability', title: 'Population vulnerability', status: 'soon' },
  ],
  plan:    [{ slug: 'mitigation-plan', title: 'Mitigation plan', status: 'soon' }],
  act:     [{ slug: 'incident-response', title: 'Incident response', status: 'soon' }],
  adapt:   [{ slug: 'reexposure', title: 'Re-exposure assessment', status: 'soon' }],
  resolve: [{ slug: 'reporting-bundle', title: 'Reporting bundle', status: 'soon' }],
  reflect: [{ slug: 'retrospective', title: 'Retrospective', status: 'soon' }],
};

/* ---------- Lanes (audience filter) ---------- */

export type LaneId = 'all' | 'consumer' | 'clinician' | 'counsel' | 'hygienist' | 'inspector';

export type Lane = { id: LaneId; label: string; caption: string };

export const LANES: Lane[] = [
  { id: 'all',        label: 'All',        caption: 'Everyone'                                   },
  { id: 'consumer',   label: 'Consumer',   caption: 'Plain-English answers and safer-use guidance' },
  { id: 'clinician',  label: 'Clinician',  caption: 'Differential, biomarkers, exposure workup'    },
  { id: 'counsel',    label: 'Counsel',    caption: 'Daubert-grade case prep'                      },
  { id: 'hygienist',  label: 'Hygienist',  caption: 'Industrial hygiene, PEL/TLV, PPE spec'        },
  { id: 'inspector',  label: 'Inspector',  caption: 'OSHA, EPA, regulatory enforcement'            },
];

export function laneFromUrl(searchParams: URLSearchParams | null): LaneId {
  const v = searchParams?.get('lane')?.toLowerCase() as LaneId | null;
  if (v && LANES.some((l) => l.id === v)) return v;
  return 'all';
}
