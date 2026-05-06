'use client';

import React, { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { getCertifiedClaims, getCase } from '@/lib/queries-tox';
import BloomingCompass from '@/components/counsel-brief/blooming-compass';
import CrossGardenConstellation from '@/components/counsel-brief/cross-garden-constellation';
import ComparisonSection from '@/components/counsel-brief/comparison-section';
import DepthButton from '@/components/counsel-brief/depth-button';
import './counsel-brief.css';

// Lazy-load heavy components
const BloomingCompassWrapper = dynamic(() => import('@/components/counsel-brief/blooming-compass'), {
  ssr: false,
});

export default function CounselBriefPage() {
  const [liveData, setLiveData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        // PCBs UUID (verified from live Supabase). substance_id is uuid-typed; the
        // string 'pcbs' would silently return zero matches.
        const PCBS_UUID = '11111111-1111-4111-8111-111111111201';
        const claims = await getCertifiedClaims({ substance_id: PCBS_UUID });
        const caseData = await getCase('sky-valley');
        setLiveData({ claims: claims.slice(0, 5), caseData });
      } catch (err) {
        // getCase may throw on this branch until the schema-reconciliation PR
        // merges. Don't crash the page; fall through to the no-data state.
        console.error('Failed to fetch live data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveData();
  }, []);

  return (
    <div className='counsel-brief'>
      {/* Blooming Navigation Compass */}
      <Suspense fallback={null}>
        <BloomingCompassWrapper position='top-right' />
      </Suspense>

      {/* Scroll progress bar */}
      <div className='scroll-progress-bar' />

      {/* SECTION 1: HERO */}
      <section id='hero' className='hero-section'>
        <div className='hero-container'>
          <div className='hero-video-wrapper'>
            <video
              autoPlay
              muted
              playsInline
              loop
              poster='/assets/counsel-brief/logo-mark-bloom-poster.png'
              className='hero-video'
              preload='metadata'
            >
              <source src='/assets/counsel-brief/logo-mark-bloom.mp4' type='video/mp4' />
              <img src='/assets/counsel-brief/logo-mark-bloom-poster.png' alt='Knowledge Gardens logo animation' />
            </video>
          </div>

          <div className='hero-content reveal-up'>
            <div className='hero-eyebrow space-mono-upper'>For Toxic-Tort Counsel</div>
            <h1 className='hero-headline cormorant-italic'>
              Daubert-ready toxicology, curated by a witness who&apos;s been there.
            </h1>
            <p className='hero-body'>
              Mold, PCBs, dioxins, glyphosate, PFAS, hexavalent chromium. The science is solid. The sourcing is scattered. Assembling auditable, tier-tagged evidence packets for one case costs forty paralegal hours at $250/hour. Surviving a Daubert challenge with it depends entirely on your expert and the chain of citation backing him up. The TKG puts a working medical toxicologist in the loop on every claim, every source, every tier badge—before it leaves the platform.
            </p>
            <div className='hero-pills reveal-stagger'>
              <div className='pill'>Auditable provenance</div>
              <div className='pill'>Court-ready deliverables</div>
              <div className='pill'>The Dahlgren signature</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM */}
      <section id='problem' className='problem-section'>
        <div className='section-container'>
          <div className='section-eyebrow space-mono-upper'>What Plaintiffs&apos; Counsel Walk Into</div>
          <h2 className='section-headline'>The science is on your side. The presentation isn&apos;t.</h2>
          <p className='section-body'>
            Toxicology evidence lives in silos. IARC monographs. ATSDR profiles. EPA IRIS records. Peer-reviewed cohort studies. Thirty years of agency reclassifications. Your paralegal assembles them. Your expert inherits them. Opposing counsel discovers all of it.
          </p>

          <div className='problem-cards reveal-stagger'>
            <div className='problem-card lift-on-hover'>
              <h3 className='card-title'>Citation Rot</h3>
              <p>
                The science you cite this quarter isn&apos;t the science the agency posts next quarter. EPA IRIS files revise. ATSDR profiles update. IARC reclassifies. If the version you cited at filing isn&apos;t the version on the website at deposition, you&apos;re handing opposing counsel an attack vector.
              </p>
            </div>

            <div className='problem-card lift-on-hover'>
              <h3 className='card-title'>Daubert Exposure</h3>
              <p>
                Motion-to-exclude is the new motion practice. FRE 702 and its 2023 amendments put the burden on you to show your expert&apos;s methods are reliable. Without a structured chain of citation, every claim is a footnote your opposing counsel will challenge in chambers.
              </p>
            </div>

            <div className='problem-card lift-on-hover'>
              <h3 className='card-title'>Discovery Surface</h3>
              <p>
                Your expert&apos;s reliance materials become opposing counsel&apos;s playground. Whatever your expert touches, opposing counsel inherits. A scattered reliance list with broken URLs and unversioned PDFs is a deposition where you spend two hours defending bibliographic hygiene instead of mechanism of injury.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THREE PILLARS */}
      <section id='pillars' className='pillars-section'>
        <div className='section-container'>
          <div className='section-eyebrow space-mono-upper'>What We Do · The Three Pillars</div>
          <h2 className='section-headline'>One platform. Three things it has to be.</h2>
          <p className='section-body'>
            The TKG isn&apos;t a database. It&apos;s a deliverable engine. Every claim you&apos;d cite, every source you&apos;d disclose, every figure you&apos;d put in front of a judge—structured, versioned, and signed off by a working medical toxicologist before it ever leaves the platform.
          </p>

          <div className='pillars-grid reveal-stagger'>
            <div className='pillar-card lift-on-hover'>
              <div className='pillar-video-wrapper'>
                <video
                  autoPlay
                  muted
                  playsInline
                  loop
                  poster='/assets/counsel-brief/stage-identify-poster.png'
                  preload='metadata'
                >
                  <source src='/assets/counsel-brief/stage-identify.mp4' type='video/mp4' />
                </video>
              </div>
              <h3 className='pillar-title'>Auditable Provenance</h3>
              <p className='pillar-body'>
                Every claim on the platform traces to a primary source, tier-tagged and timestamped to the exact document version cited. Three-source minimum. The chain holds whether opposing counsel pulls it on filing day or two years into discovery.
              </p>
              <div className='tier-badges'>
                <span className='tier-badge tier-1'>T1: Regulatory (IARC, EPA IRIS, ATSDR)</span>
                <span className='tier-badge tier-2'>T2: Peer-reviewed cohort and mechanism</span>
                <span className='tier-badge tier-3'>T3: Agency profile and secondary review</span>
              </div>
            </div>

            <div className='pillar-card lift-on-hover'>
              <div className='pillar-video-wrapper'>
                <video
                  autoPlay
                  muted
                  playsInline
                  loop
                  poster='/assets/counsel-brief/stage-assess-poster.png'
                  preload='metadata'
                >
                  <source src='/assets/counsel-brief/stage-assess.mp4' type='video/mp4' />
                </video>
              </div>
              <h3 className='pillar-title'>Court-Ready Deliverables</h3>
              <p className='pillar-body'>
                Output is structured for FRE 702 from the first byte. Bradford Hill criteria mapped per claim. Exhibit-ready PDFs that fit a senior associate&apos;s binder, not a slide deck. Every citation is bates-numberable; every figure has the cite under it.
              </p>
              <div className='formats-list'>
                <span className='format-badge'>PDF</span>
                <span className='format-badge'>JSON-LD</span>
                <span className='format-badge'>CSV</span>
                <span className='format-badge'>Bates-ready</span>
                <span className='format-badge'>Versioned</span>
              </div>
            </div>

            <div className='pillar-card lift-on-hover'>
              <div className='pillar-video-wrapper'>
                <video
                  autoPlay
                  muted
                  playsInline
                  loop
                  poster='/assets/counsel-brief/stage-plan-poster.png'
                  preload='metadata'
                >
                  <source src='/assets/counsel-brief/stage-plan.mp4' type='video/mp4' />
                </video>
              </div>
              <h3 className='pillar-title'>The Dahlgren Signature</h3>
              <p className='pillar-body'>
                Every claim, source ranking, and tier badge passes a working toxicologist&apos;s deposition lens before it goes live. Not a panel. Not a committee. A name—James G. Dahlgren, M.D.—that opposing counsel has to confront, not the platform.
              </p>
              <div className='dahlgren-callout'>
                <em>Forty years of cross-examination. Now in the data layer.</em>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: DAHLGREN SPOTLIGHT */}
      <section id='dahlgren' className='dahlgren-section'>
        <div className='section-container'>
          <div className='section-eyebrow space-mono-upper'>The Toxicologist in the Loop</div>
          <h2 className='section-headline'>James G. Dahlgren, M.D. Forty years on the witness stand. Now in the data layer.</h2>

          <div className='dahlgren-profile reveal-up'>
            <div className='profile-header'>
              <h3 className='profile-name'>James G. Dahlgren, M.D.</h3>
              <p className='profile-specialty'>Occupational &amp; Environmental Toxicology</p>
            </div>

            <p className='profile-bio'>
              Dr. Dahlgren is a board-certified internist and toxicologist with decades of expert-witness experience in chemical-exposure litigation—PCBs, dioxin, asbestos, hexavalent chromium, and the long tail of modern toxic-tort substances. He is the lead toxicology expert in the Sky Valley PCB case (Erickson v. Monsanto), and the curator of every claim, source, and tier ranking in the Toxicology Knowledge Garden.
            </p>

            <div className='timeline-grid reveal-stagger'>
              <div className='timeline-item'>
                <div className='timeline-year space-mono-upper'>1980s</div>
                <div className='timeline-title'>Founding</div>
                <p>
                  James Dahlgren Medical. Independent occupational and environmental medicine practice in Los Angeles. Clinical care of patients with chemical-exposure injuries, plus expert evaluation for litigation.
                </p>
              </div>

              <div className='timeline-item'>
                <div className='timeline-year space-mono-upper'>1996</div>
                <div className='timeline-title'>Hinkley, California</div>
                <p>
                  Served as toxicology expert examining residents of Hinkley for health effects of hexavalent chromium exposure in groundwater. Anderson v. Pacific Gas &amp; Electric. $333 million settlement. The case that became the Erin Brockovich film.
                </p>
              </div>

              <div className='timeline-item'>
                <div className='timeline-year space-mono-upper'>2019</div>
                <div className='timeline-title'>Sky Valley Retained</div>
                <p>
                  Lead toxicology expert for the plaintiffs in the Sky Valley Education Center PCB-contamination case. King County, Washington. PCBs and dioxin/furans bioaccumulating in occupants of a school building with PCB-containing caulk.
                </p>
              </div>

              <div className='timeline-item'>
                <div className='timeline-year space-mono-upper'>2025</div>
                <div className='timeline-title'>Appellate Victory</div>
                <p>
                  $185 million verdict upheld by the Washington Supreme Court (6–3, October 2025). The jury award stood. The expert testimony stood. The cross-examination didn&apos;t crack it.
                </p>
              </div>
            </div>

            <div className='dahlgren-quote'>
              <p className='quote-text cormorant-italic'>
                &quot;Chromium was the poison in the Brockovich case. Chromium is super toxic and super carcinogenic. But chromium is only one molecule. There are thousands of toxic substances out there. The next case you walk into, you do not have to start from zero. The Garden is already there.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: DELIVERABLES */}
      <section id='deliverables' className='deliverables-section'>
        <div className='section-container'>
          <div className='section-eyebrow space-mono-upper'>What Lawyers Actually Buy</div>
          <h2 className='section-headline'>The deliverables menu.</h2>
          <p className='section-body'>
            Twelve productized, named SKUs. All are case-specific or substance-specific. All are versioned, citation-grade, and Dahlgren-reviewed. Order one or order the bundle.
          </p>

          <div className='deliverables-grid reveal-stagger'>
            <div className='deliverable-card'>
              <h4 className='del-number'>DEL-01</h4>
              <h3 className='del-title'>Daubert-Ready Exhibit Packet</h3>
              <p className='del-desc'>
                Per-substance, per-jurisdiction. Strength-of-evidence map, tier-tagged source bibliography, Bradford Hill mapping per causal claim, anticipated cross-examination prep, and expert-credentials block. Ships as a chambers-ready PDF plus the underlying JSON-LD.
              </p>
              <div className='del-meta'>Dahlgren-signed | PDF, JSON-LD</div>
            </div>

            <div className='deliverable-card'>
              <h4 className='del-number'>DEL-02</h4>
              <h3 className='del-title'>Compound Dossier</h3>
              <p className='del-desc'>
                Single-substance deep file: mechanism of toxicity, dose-response curves, latency periods, diagnostic biomarkers, accepted exposure metrics, regulatory thresholds across IARC / EPA / ATSDR / OSHA / WHO.
              </p>
              <div className='del-meta'>PDF, JSON-LD</div>
            </div>

            <div className='deliverable-card'>
              <h4 className='del-number'>DEL-03</h4>
              <h3 className='del-title'>Cohort Library Brief</h3>
              <p className='del-desc'>
                Curated epidemiological cohort studies for a substance + outcome pair. Yu-Cheng, Faroe Islands, Tar Creek, Anniston AL, NHL/glyphosate, vinyl chloride/angiosarcoma. Effect sizes, population characteristics, exposure assessment methodology.
              </p>
              <div className='del-meta'>PDF, CSV</div>
            </div>

            <div className='deliverable-card'>
              <h4 className='del-number'>DEL-04</h4>
              <h3 className='del-title'>Strength-of-Evidence Memo</h3>
              <p className='del-desc'>
                Ranks the strongest causal claims for a specific fact pattern. Plaintiffs&apos; brief-shaped: which claims to lead with at trial, which to settle through, which to cite only in expert disclosure.
              </p>
              <div className='del-meta'>Dahlgren-signed | PDF</div>
            </div>

            <div className='deliverable-card'>
              <h4 className='del-number'>DEL-05</h4>
              <h3 className='del-title'>Bradford Hill Mapping</h3>
              <p className='del-desc'>
                Per-claim mapping to all nine Bradford Hill criteria with source citations. Strength, consistency, specificity, temporality, biological gradient, plausibility, coherence, experiment, analogy—each with the strongest cite in your bibliography.
              </p>
              <div className='del-meta'>PDF, JSON-LD</div>
            </div>

            <div className='deliverable-card'>
              <h4 className='del-number'>DEL-06</h4>
              <h3 className='del-title'>Expert Disclosure (Rule 26)</h3>
              <p className='del-desc'>
                Pre-formatted FRCP Rule 26(a)(2)(B) disclosure with CV, methods statement, complete reliance list with versioned/timestamped citations, and prior-testimony list for the past four years.
              </p>
              <div className='del-meta'>Dahlgren-signed | DOCX, PDF</div>
            </div>

            <div className='deliverable-card'>
              <h4 className='del-number'>DEL-07</h4>
              <h3 className='del-title'>Cross-Examination Brief</h3>
              <p className='del-desc'>
                Common defense arguments at deposition with rebuttal authority. Anticipated motions to exclude with reliability and fit responses. Junk-science attacks with the agency citations that defeat them.
              </p>
              <div className='del-meta'>PDF</div>
            </div>

            <div className='deliverable-card'>
              <h4 className='del-number'>DEL-08</h4>
              <h3 className='del-title'>Regulatory Timeline</h3>
              <p className='del-desc'>
                Agency-knowledge timeline for any substance: IARC reclassifications, EPA IRIS revisions, ATSDR profile updates, OSHA PEL changes. The &quot;what did they know and when&quot; exhibit, prebuilt.
              </p>
              <div className='del-meta'>PDF, CSV</div>
            </div>

            <div className='deliverable-card'>
              <h4 className='del-number'>DEL-12</h4>
              <h3 className='del-title'>Custom Curation (Dahlgren In The Loop)</h3>
              <p className='del-desc'>
                Direct Dr. Dahlgren engagement on your specific case theory. Curation memo on the strongest evidentiary path, gaps to fill in expert work, and the substance-specific Daubert posture for your jurisdiction.
              </p>
              <div className='del-meta'>Dahlgren · 1:1</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: DEMO PATH */}
      <section id='demo' className='demo-section'>
        <div className='section-container'>
          <div className='section-eyebrow space-mono-upper'>The Demo · Five Stages, Ninety Seconds</div>
          <h2 className='section-headline'>From case file to chambers-ready packet.</h2>
          <p className='section-body'>
            This is the actual flow Dr. Dahlgren walks through with plaintiffs&apos; counsel. Live on the platform at toxicology.theknowledgegardens.com. The five stages compress forty paralegal hours into a workflow.
          </p>

          <div className='demo-stages reveal-stagger'>
            <div className='demo-stage lift-on-hover'>
              <div className='stage-number'>1</div>
              <h3 className='stage-title'>Case File</h3>
              <p>
                Walk through <Link href='/case/sky-valley' className='link'>/case/sky-valley</Link>. The case file pre-populates everything: parties, parties&apos; counsel, retained experts, the document corpus, the linked substances, and a 12-event chronology spanning EPA inspection, school closure, filing, expert retention, depositions, and trial. Erickson v. Monsanto. Sky Valley Education Center. King County Superior Court, Washington. PCB and dioxin contamination.
              </p>
              {liveData.caseData && (
                <div className='live-data-preview'>
                  <small className='live-badge'>Live from Supabase</small>
                  <p><strong>Case:</strong> {liveData.caseData.name}</p>
                  <p><strong>Jurisdiction:</strong> {liveData.caseData.jurisdiction}</p>
                </div>
              )}
            </div>

            <div className='demo-stage lift-on-hover'>
              <div className='stage-number'>2</div>
              <h3 className='stage-title'>Compound &amp; Claims</h3>
              <p>
                Click into <Link href='/compound/pcbs' className='link'>/compound/pcbs</Link>. Eight certified claims, each tier-tagged and source-anchored. IARC Monograph 107. ATSDR toxicological profile. Yu-Cheng cohort (Taiwan, 1979). Faroe Islands cohort (NHANES analog). Anniston, Alabama. The T1 / T2 / T3 source-tier badges are the same strength-of-evidence hierarchy a working toxicologist uses in deposition prep.
              </p>
              {liveData.claims && liveData.claims.length > 0 && (
                <div className='live-data-preview'>
                  <small className='live-badge'>Live certified claims count: {liveData.claims.length}</small>
                  {liveData.claims.slice(0, 2).map((claim: any, idx: number) => (
                    <p key={idx}><em>{claim.claim_title}</em> — Tier {claim.tier}</p>
                  ))}
                </div>
              )}
            </div>

            <div className='demo-stage lift-on-hover'>
              <div className='stage-number'>3</div>
              <h3 className='stage-title'>Expert Profile</h3>
              <p>
                Click his name → <Link href='/expert/dahlgren' className='link'>/expert/dahlgren</Link>. His profile is the canonical entry point to his work. Curated bio, specialty, prior-testimony record, the cases he&apos;s signed onto in the platform, and the version-pinned substance dossiers behind his sworn opinions. When opposing counsel does discovery on you, this is what they find. Curated. Cited. Versioned.
              </p>
            </div>

            <div className='demo-stage lift-on-hover'>
              <div className='stage-number'>4</div>
              <h3 className='stage-title'>Counsel Flow</h3>
              <p>
                Open the Counsel Flow. Walk five stages: Frame the theory of harm. Assemble the source set. Argue the Daubert posture—certified vs. contested claims, both sides of every contested cite. Witness the expert pack with credentials and prior testimony. File. Generate the Case-Prep Exhibit Packet PDF.
              </p>
            </div>

            <div className='demo-stage lift-on-hover'>
              <div className='stage-number'>5</div>
              <h3 className='stage-title'>The Comparison</h3>
              <p>
                90 seconds on the TKG. 40 hours at the firm. Same substance. Same case theory. Same Daubert standard. One has a Dahlgren signature. The other doesn&apos;t.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: CROSS-GARDEN ECOSYSTEM */}
      <section id='cross-garden' className='cross-garden-section'>
        <div className='section-container'>
          <div className='section-eyebrow space-mono-upper'>One Platform. Every Discipline.</div>
          <h2 className='section-headline'>The ecosystem that compounds your advantage.</h2>
          <p className='section-body'>
            The Toxicology Garden is one node in a growing ecosystem. Each garden is independent. Each is cross-citable. Together, they create the witness chain judges can&apos;t impeach.
          </p>

          <Suspense fallback={<div className='loading-placeholder'>Loading cross-garden constellation...</div>}>
            <CrossGardenConstellation />
          </Suspense>

          <div className='cross-garden-narrative reveal-up'>
            <p>
              When a TKG claim about glyphosate&apos;s neurotoxic mechanism is also tagged and cross-cited in the Health Knowledge Garden (HKG), something shifts. An HKG-affiliated treating clinician pulls up the patient&apos;s neurological workup and sees the same glyphosate evidence surface in the HKG context. The toxicology claim has just been strengthened by clinical verification.
            </p>
            <p>
              Same substance, same endpoint, two independent gardens confirming the thread. That is harder to impeach.
            </p>
            <p>
              By the time the Builder&apos;s Knowledge Garden, NatureMark, and future gardens are live, your subscription pays for access to the combined expertise of toxicologists, construction engineers, environmental scientists, and regulators—all speaking the same citation language, all cross-referencing each other&apos;s evidence, all subject to the same verification rigor.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8: COMPARISON */}
      <section id='comparison' className='comparison-section'>
        <div className='section-container'>
          <div className='section-eyebrow space-mono-upper'>The Closing Argument · Same Prompt, Two Outputs</div>
          <h2 className='section-headline'>One chatbot. One curated knowledge garden.</h2>

          <Suspense fallback={<div className='loading-placeholder'>Loading comparison...</div>}>
            <ComparisonSection />
          </Suspense>

          <p className='comparison-takeaway'>
            The chatbot writes about toxicology. The TKG is toxicology. Generic LLMs are excellent prose engines. They are not source-of-truth systems. The TKG is a source-of-truth system with a working medical toxicologist&apos;s name on every claim. That&apos;s the difference between a draft and a deliverable, and it&apos;s the difference between an expert that survives Daubert and one that doesn&apos;t.
          </p>
        </div>
      </section>

      {/* SECTION 9: ENGAGEMENT / CTA */}
      <section id='engagement' className='engagement-section'>
        <div className='section-container'>
          <div className='section-eyebrow space-mono-upper'>How Counsel Engages</div>
          <h2 className='section-headline'>Three ways to start.</h2>

          <div className='engagement-tiers reveal-stagger'>
            <div className='tier-card lift-on-hover'>
              <h3 className='tier-title'>Tier 1: Single Deliverable</h3>
              <p className='tier-description'>
                Buy a Daubert-Ready Exhibit Packet for one substance, one case. You name the substance and case theory. We deliver the packet. Dahlgren-signed. Versioned. Bates-ready. Five business days.
              </p>
            </div>

            <div className='tier-card lift-on-hover'>
              <h3 className='tier-title'>Tier 2: Case-Long Subscription</h3>
              <p className='tier-description'>
                Unlimited deliverables across the case lifecycle. From intake through trial. Compound dossiers, cohort briefs, regulatory timelines, cross-exam briefs—whatever the case needs. Single price per case per year.
              </p>
            </div>

            <div className='tier-card lift-on-hover'>
              <h3 className='tier-title'>Tier 3: Dahlgren-In-The-Loop Retainer</h3>
              <p className='tier-description'>
                Direct engagement on case theory and expert posture. For complex MDLs, novel substance theories, or cases where the expert posture is the case. Dr. Dahlgren reviews your theory directly and curates the substance evidence around it.
              </p>
            </div>
          </div>

          <div className='cta-block reveal-up'>
            <div className='section-eyebrow space-mono-upper'>Get the Brief</div>
            <h3 className='cta-headline'>Send us the case. Get the packet in five days.</h3>
            <p className='cta-body'>
              Email us with the substance, the jurisdiction, and the theory of harm. We&apos;ll come back with a scoped deliverable, a delivery date, and a Dahlgren-signed packet at the end of the week.
            </p>
            <div className='cta-buttons'>
              <a
                href='mailto:counsel@theknowledgegardens.com'
                className='btn btn-primary'
              >
                Email Counsel Intake
              </a>
              <p className='cta-footer'>counsel@theknowledgegardens.com · toxicology.theknowledgegardens.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
