'use client';

/**
 * /workflow/identify/sds-retrieval — MVP interactive workflow (Compound Lookup).
 * Currently contains the Compound Lookup MVP per brief §3.2.
 * This file serves as the live MVP workflow.
 * Five questions: What is this substance? CAS number? Hazard class? Route of exposure? Regulatory limits?
 */

import { useState } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/home/ScrollReveal';

type QuestionKey = 'substance' | 'cas' | 'hazard' | 'route' | 'regulatory';

const QUESTIONS: Record<QuestionKey, { prompt: string; placeholder: string }> = {
  substance: { prompt: 'What is this substance?', placeholder: 'e.g., Glyphosate, Roundup' },
  cas: { prompt: "What's the CAS number?", placeholder: 'e.g., 1071-83-6' },
  hazard: { prompt: 'What hazard class?', placeholder: 'e.g., Category 2, Acute toxicity' },
  route: { prompt: "What's the relevant route of exposure?", placeholder: 'e.g., Inhalation, Dermal, Ingestion' },
  regulatory: { prompt: 'What regulatory limits apply?', placeholder: 'e.g., OSHA PEL, EPA water limit' },
};

export default function CompoundLookupPage() {
  const [activeQuestion, setActiveQuestion] = useState<QuestionKey>('substance');
  const [answers, setAnswers] = useState<Partial<Record<QuestionKey, string>>>({});

  const questionOrder: QuestionKey[] = ['substance', 'cas', 'hazard', 'route', 'regulatory'];
  const questionIndex = questionOrder.indexOf(activeQuestion);
  const currentQuestion = QUESTIONS[activeQuestion];

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [activeQuestion]: value }));
    if (questionIndex < questionOrder.length - 1) {
      setActiveQuestion(questionOrder[questionIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (questionIndex > 0) {
      setActiveQuestion(questionOrder[questionIndex - 1]);
    }
  };

  const isComplete = questionOrder.every((q) => answers[q]);

  return (
    <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
      <section className="relative py-24 sm:py-32" style={{ minHeight: '60vh', background: 'linear-gradient(135deg, var(--paper-warm) 0%, var(--paper) 100%)' }}>
        <div className="rail-default">
          <ScrollReveal>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--copper-orn-deep)' }}>
              identify stage · live workflow
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <h1 className="mx-auto mt-5 max-w-[20ch]" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 500, lineHeight: 1.05, color: 'var(--ink)' }}>
              Compound lookup
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="prose-rail mt-6">
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--ink-soft)' }}>
                Answer five quick questions to look up a substance in the evidence garden.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={450}>
            <div className="mt-10 flex justify-center">
              <video poster="/icons/stage-identify.png" autoPlay muted loop playsInline width={120} height={120} style={{ display: 'inline-block' }}>
                <source src="/icons/stage-identify.mp4" type="video/mp4" />
              </video>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="sticky top-0 z-10 border-b border-[var(--paper-line)] bg-[var(--paper)] py-4 backdrop-blur">
        <div className="rail-default">
          <div className="flex items-center justify-between">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--ink-mute)', textTransform: 'uppercase' }}>
              Question {questionIndex + 1} of {questionOrder.length}
            </div>
            <div style={{ flex: 1, marginLeft: '1rem', marginRight: '1rem', height: '4px', background: 'var(--paper-line)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--copper-orn-deep)', width: `${((questionIndex + 1) / questionOrder.length) * 100}%`, transition: 'width 300ms ease' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-mute)' }}>
              {Math.round(((questionIndex + 1) / questionOrder.length) * 100)}%
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper)] py-20">
        <div className="rail-default max-w-2xl">
          <ScrollReveal>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--copper-orn-deep)', marginBottom: '1rem' }}>
              step {questionIndex + 1}
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 500, color: 'var(--ink)', marginBottom: '2rem' }}>
              {currentQuestion.prompt}
            </h2>
            <div className="rounded-lg border border-[var(--paper-line)] bg-white p-6" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
              <input
                type="text"
                placeholder={currentQuestion.placeholder}
                value={answers[activeQuestion] || ''}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [activeQuestion]: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter' && answers[activeQuestion]) handleAnswer(answers[activeQuestion]!); }}
                autoFocus
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontFamily: 'var(--font-body)', border: 'none', outline: 'none', background: 'transparent', color: 'var(--ink)' }}
              />
            </div>
            <div className="mt-8 flex gap-4">
              <button
                onClick={handlePrev}
                disabled={questionIndex === 0}
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', padding: '0.75rem 1.5rem', border: '1px solid var(--paper-line)', background: 'transparent', color: questionIndex === 0 ? 'var(--ink-mute)' : 'var(--ink)', borderRadius: '0.5rem', cursor: questionIndex === 0 ? 'not-allowed' : 'pointer', opacity: questionIndex === 0 ? 0.5 : 1 }}
              >
                ← Previous
              </button>
              <button
                onClick={() => handleAnswer(answers[activeQuestion] || '')}
                disabled={!answers[activeQuestion]}
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', padding: '0.75rem 1.5rem', border: 'none', background: answers[activeQuestion] ? 'var(--copper-orn-deep)' : 'var(--paper-line)', color: 'white', borderRadius: '0.5rem', cursor: answers[activeQuestion] ? 'pointer' : 'not-allowed', flex: 1 }}
              >
                {questionIndex === questionOrder.length - 1 ? 'Complete' : 'Next'}
              </button>
            </div>

            {Object.keys(answers).length > 0 && (
              <div className="mt-12 rounded-lg border border-[var(--paper-line)] bg-[var(--paper-warm)] p-6" style={{ maxWidth: '65ch' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--copper-orn-deep)', marginBottom: '1rem' }}>
                  Your answers
                </div>
                <div className="space-y-2">
                  {questionOrder.map((q) =>
                    answers[q] && (
                      <div key={q} style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                        <strong style={{ color: 'var(--ink)' }}>{QUESTIONS[q].prompt}</strong><br />
                        {answers[q]}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {isComplete && (
              <div className="mt-12 rounded-lg border border-[var(--teal-deep)] bg-[var(--paper-warm)] p-8 text-center">
                <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.6rem', color: 'var(--ink)', marginBottom: '1rem' }}>
                  Lookup complete!
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--ink-soft)', marginBottom: '1.5rem' }}>
                  In a live implementation, this would show the substance detail page.
                </p>
                <Link href="/compound" style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', padding: '0.75rem 1.5rem', background: 'var(--teal-deep)', color: 'white', borderRadius: '0.5rem', display: 'inline-block', textDecoration: 'none' }}>
                  Browse all substances →
                </Link>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-[var(--paper-warm)] py-12 text-center border-t border-[var(--paper-line)]">
        <Link href="/workflow/identify" style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--teal-deep)', textDecoration: 'underline' }}>
          ← Back to Identify stage
        </Link>
      </section>
    </main>
  );
}
