'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CompassProps {
  currentSection?: string;
  onSectionClick?: (section: string) => void;
  position?: 'bottom-right' | 'top-right';
}

const sections = [
  { id: 'hero', label: 'Hero' },
  { id: 'problem', label: 'Problem' },
  { id: 'pillars', label: 'Pillars' },
  { id: 'dahlgren', label: 'Dahlgren' },
  { id: 'deliverables', label: 'Deliver' },
  { id: 'demo', label: 'Demo' },
  { id: 'cross-garden', label: 'Ecosystem' },
  { id: 'comparison', label: 'Compare' },
  { id: 'engagement', label: 'Engage' },
];

export default function BloomingCompass({
  currentSection = 'hero',
  position = 'top-right',
}: CompassProps) {
  const [activeSection, setActiveSection] = useState(currentSection);
  const [isBloomed, setIsBloomed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsBloomed(window.scrollY > 100);
    };

    const observerOptions: IntersectionObserverInit = {
      threshold: 0.3,
      rootMargin: '0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sections.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handleSpokeClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const positionClasses = position === 'top-right' ? 'top-6 right-6' : 'bottom-6 right-6';

  return (
    <div
      className={`fixed ${positionClasses} z-80 pointer-events-none`}
      style={{ width: '240px', height: '240px' }}
    >
      <svg
        viewBox='0 0 240 240'
        className={`w-full h-full transition-opacity duration-500 ${
          isBloomed ? 'opacity-100' : 'opacity-60'
        } hover:opacity-100 pointer-events-auto`}
        style={{
          filter: isBloomed ? 'drop-shadow(0 8px 24px rgba(31, 63, 63, 0.15))' : 'none',
        }}
      >
        <defs>
          <style>{`
            .spoke { transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
            .spoke-circle {
              transition: fill 0.3s ease, r 0.3s ease;
              cursor: pointer;
            }
            .spoke-circle:hover { r: 20px; }
            .spoke-text {
              font-family: 'Space Mono', monospace;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.08em;
              text-anchor: middle;
              dominant-baseline: middle;
              cursor: pointer;
              transition: fill 0.3s ease;
            }
            .spoke.active circle { fill: #0f3f3f; }
            .compass-bloomed .spoke { opacity: 1; }
            @media (prefers-reduced-motion: reduce) {
              .spoke { animation: none !important; }
            }
          `}</style>
        </defs>

        <circle cx='120' cy='120' r='118' fill='none' stroke='#1A5C5C' strokeWidth='0.5' opacity='0.2' />

        {/* Spokes (simplified: 6 main directions) */}
        {[
          { id: 'hero', x: 120, y: 50, label: 'Hero' },
          { id: 'pillars', x: 184.3, y: 70, label: 'Pillars' },
          { id: 'dahlgren', x: 184.3, y: 170, label: 'Dahlgren' },
          { id: 'deliverables', x: 120, y: 190, label: 'Deliver' },
          { id: 'demo', x: 55.7, y: 170, label: 'Demo' },
          { id: 'comparison', x: 55.7, y: 70, label: 'Compare' },
        ].map((spoke) => (
          <g
            key={spoke.id}
            className={`spoke ${activeSection === spoke.id ? 'active' : ''}`}
            onClick={() => handleSpokeClick(spoke.id)}
            role='button'
            tabIndex={0}
            aria-label={`Navigate to ${spoke.label}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSpokeClick(spoke.id);
              }
            }}
          >
            <line
              x1='120'
              y1='120'
              x2={spoke.x}
              y2={spoke.y}
              stroke='#B87333'
              strokeWidth='1.5'
              opacity='0.3'
            />
            <circle className='spoke-circle' cx={spoke.x} cy={spoke.y} r='16' fill='#1A5C5C' />
            <text className='spoke-text' x={spoke.x} y={spoke.y} fill='#FBF8F3'>
              {spoke.label}
            </text>
          </g>
        ))}

        {/* Hub */}
        <g className='hub'>
          <circle cx='120' cy='120' r='18' fill='#B87333' opacity='0.9' />
          <line x1='120' y1='110' x2='120' y2='102' stroke='#FBF8F3' strokeWidth='1.2' opacity='0.7' />
          <line x1='126.4' y1='113' x2='132' y2='108' stroke='#FBF8F3' strokeWidth='1.2' opacity='0.7' />
          <line x1='113.6' y1='113' x2='108' y2='108' stroke='#FBF8F3' strokeWidth='1.2' opacity='0.7' />
          <text
            x='120'
            y='120'
            fontFamily='Cormorant Garamond, serif'
            fontSize='16'
            fontWeight='500'
            fontStyle='italic'
            textAnchor='middle'
            dominantBaseline='middle'
            fill='#f5f0e8'
          >
            TKG
          </text>
        </g>

        <circle cx='120' cy='120' r='112' fill='none' stroke='#8f5a26' strokeWidth='0.75' opacity='0.25' strokeDasharray='4,6' />
      </svg>
    </div>
  );
}
