'use client';

import React, { useState } from 'react';

export default function ComparisonSection() {
  return (
    <div className='comparison-container'>
      <div className='comparison-grid'>
        {/* ChatGPT side */}
        <div className='comparison-side'>
          <h3 className='comparison-title'>ChatGPT Output</h3>
          <div className='comparison-content'>
            <p>
              PCBs have been linked to adverse health effects in residential occupancy contexts. Some studies suggest an increased risk of cancers including non-Hodgkin lymphoma, and research has indicated potential developmental effects from prenatal exposure. The IARC has classified PCBs in a higher carcinogenicity group, and the EPA has set various exposure limits. Specific peer-reviewed citations for this claim should be verified before use in a legal proceeding.
            </p>
            <div className='comparison-disclaimer'>
              <strong>Disclaimer:</strong> &quot;I&apos;m an AI language model and may make mistakes, especially with citations. Please verify all sources independently before relying on this information.&quot;
            </div>
            <div className='comparison-capability'>
              <strong>What you can do:</strong> Use it for prose draft only. Cannot cite. Cannot disclose. Cannot defend.
            </div>
          </div>
        </div>

        {/* TKG side */}
        <div className='comparison-side'>
          <h3 className='comparison-title'>TKG Output</h3>
          <div className='comparison-content'>
            <div className='tkg-claim'>
              <p className='claim-text'>PCBs are carcinogenic to humans.</p>
              <span className='tier-badge tier-1'>[T1] IARC 107 (2016)</span>
            </div>

            <div className='tkg-claim'>
              <p className='claim-text'>PCB exposure causes non-Hodgkin lymphoma.</p>
              <span className='tier-badge tier-1'>[T1] IARC 107 (2016) · [T2] Anniston cohort</span>
            </div>

            <div className='tkg-claim'>
              <p className='claim-text'>Prenatal exposure impairs neurodevelopment.</p>
              <span className='tier-badge tier-2'>[T2] Faroe Islands cohort · [T3] ATSDR profile</span>
            </div>

            <div className='comparison-capability'>
              <strong>What you can do:</strong> Cite directly. Drop into a Rule 26 disclosure. Attach to a brief. Defend in deposition.
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .comparison-container {
          margin-top: 2rem;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .comparison-side {
          background: #fbf8f3;
          padding: 2rem;
          border: 1px solid rgba(26, 92, 92, 0.1);
          border-radius: 4px;
        }

        .comparison-side:nth-child(2) {
          background: rgba(197, 168, 76, 0.05);
          border-color: #c9a84c;
        }

        .comparison-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: #1a5c5c;
          margin-bottom: 1.5rem;
        }

        .comparison-content p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #4a4a4a;
          margin-bottom: 1.5rem;
        }

        .comparison-disclaimer {
          padding: 1rem;
          background: #efe8d0;
          border-left: 3px solid #999;
          border-radius: 2px;
          font-size: 0.85rem;
          line-height: 1.6;
          color: #5e5e5e;
          margin-bottom: 1rem;
        }

        .comparison-disclaimer strong {
          display: block;
          margin-bottom: 0.5rem;
          color: #2c2c2c;
        }

        .tkg-claim {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(26, 92, 92, 0.1);
        }

        .tkg-claim:last-of-type {
          border-bottom: none;
        }

        .claim-text {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #2c2c2c;
          margin-bottom: 0.6rem;
          font-weight: 500;
        }

        .tier-badge {
          display: inline-block;
          padding: 0.35rem 0.7rem;
          background: #ede7d4;
          border-left: 3px solid #b87333;
          border-radius: 2px;
          font-family: 'Space Mono', monospace;
          font-size: 0.8rem;
          color: #0f3f3f;
          line-height: 1.4;
        }

        .tier-1 {
          border-left-color: #d4a574;
        }

        .tier-2 {
          border-left-color: #b87333;
        }

        .tier-3 {
          border-left-color: #8f5a26;
        }

        .comparison-capability {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(26, 92, 92, 0.1);
          font-size: 0.9rem;
          line-height: 1.6;
          color: #1a5c5c;
        }

        .comparison-capability strong {
          display: block;
          margin-bottom: 0.5rem;
          color: #0f3f3f;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .comparison-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
