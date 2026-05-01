/**
 * The TKG design grammar — ten primitives, every surface uses them.
 * Brothers-and-sisters principle (Jonny Ive). If a new surface needs a
 * pattern that isn't here, propose it as a new primitive — don't one-off it.
 */
export { default as TopFrame }       from './TopFrame';
export { default as TimeMachine }    from './TimeMachine';
export { default as StageStepper }   from './StageStepper';
export { default as HeroImage }      from './HeroImage';
export { default as SuggestionCards } from './SuggestionCards';
export type { Suggestion } from './SuggestionCards';
export { default as AskBox }         from './AskBox';
export { default as Lanes, useCurrentLane } from './Lanes';
export { default as WorkflowCard }   from './WorkflowCard';
export { default as QuestionRow }    from './QuestionRow';
export { default as ProToggle, useIsPro } from './ProToggle';

export * from './stages';
