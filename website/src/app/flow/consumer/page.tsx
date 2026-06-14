'use client';

/**
 * /flow/consumer — the Consumer Killer App (plain-language exposure guide).
 * The form-wizard is gone; this is the situation-driven workspace.
 */
import SituationWorkspace from '@/components/flow/SituationWorkspace';

export default function ConsumerKillerApp() {
  return (
    <SituationWorkspace
      config={{
        lane: 'consumer',
        plate: '/plates/audience-consumers.png',
        eyebrow: 'Consumer workspace · plain-language toxicology',
        title: "What's in my world?",
        deliverable: 'Personal Toxicity Briefing',
        deliverableSub: 'A citable answer, not a vibe — one page, plain language',
        inputLabel: 'Tell the garden about your situation',
        placeholder: 'e.g., we just moved into a house near an old rail yard and want to know what we might be exposed to',
        defaultSituation: 'We just moved into a house near a former industrial site / rail yard and want to know what we might be exposed to.',
        takeLabel: 'AI take · plain language',
        takePrompt: (s) =>
          `PCBs, dioxins, glyphosate, microplastics, lead, exposure, drinking water, soil, food. Situation: ${s} In plain language, no jargon: what am I most likely being exposed to, how worried should I actually be, and what can I do about it? Keep it concrete and calm — real risk in proportion, not alarm and not false comfort.`,
        presets: [
          { label: 'Near an old rail yard', situation: 'We live near a former rail yard / industrial site and are worried about soil and dust contamination (PCBs, dioxins, lead).' },
          { label: 'Plastics in our water', situation: "We're worried about microplastics and plastic chemicals in our drinking water and food." },
          { label: 'Glyphosate in food', situation: 'We want to understand glyphosate / pesticide residue in the food we eat and how to reduce it.' },
        ],
        moves: [
          { key: 'exposed', title: 'What am I exposed to?', sub: 'The likely culprits, named', prompt: (s) => `PCBs, dioxins, glyphosate, microplastics, lead. Situation: ${s} In plain language, what am I most likely being exposed to, and through what (water, soil, food, air)?` },
          { key: 'worried', title: 'How worried should I be?', sub: 'Real risk, in proportion', prompt: (s) => `Situation: ${s} How worried should I actually be? Put the real risk in proportion, plainly — no alarm, no false comfort.` },
          { key: 'today', title: 'What can I do today?', sub: 'Concrete steps that help', prompt: (s) => `Situation: ${s} Give me concrete steps I can take today to reduce exposure, most-effective first.` },
          { key: 'swaps', title: 'Safer alternatives', sub: 'Swaps that actually matter', prompt: (s) => `Situation: ${s} Suggest safer alternatives and swaps that meaningfully reduce exposure for my situation.` },
        ],
        footerLinks: [
          { href: '/compound', label: 'Browse compounds' },
        ],
      }}
    />
  );
}
