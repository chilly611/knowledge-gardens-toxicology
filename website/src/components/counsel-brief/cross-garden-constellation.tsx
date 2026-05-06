'use client';

import React, { useState } from 'react';

const gardens = [
  {
    id: 'hkg',
    name: 'Health Knowledge Garden',
    position: 'top',
    x: 300,
    y: 60,
    color: '#c41e3a',
    links: 8,
    tagline: 'The clinician who\'ll testify with you',
  },
  {
    id: 'bkg',
    name: 'Builder\'s Knowledge Garden',
    position: 'right',
    x: 480,
    y: 300,
    color: '#b87333',
    links: 2,
    tagline: 'The construction defect engineer\'s evidence base',
  },
  {
    id: 'naturemark',
    name: 'NatureMark',
    position: 'bottom-right',
    x: 420,
    y: 480,
    color: '#2a7a7a',
    links: 4,
    tagline: 'The environmental sampling expert\'s provenance',
  },
  {
    id: 'future',
    name: 'Future Gardens',
    position: 'left',
    x: 120,
    y: 300,
    color: '#999999',
    links: 0,
    tagline: 'The regulator\'s institutional memory',
  },
];

export default function CrossGardenConstellation() {
  const [hoveredGarden, setHoveredGarden] = useState<string | null>(null);

  return (
    <div className='cross-garden-constellation'>
      <svg viewBox='0 0 600 600' width='100%' height='auto' preserveAspectRatio='xMidYMid meet'>
        <defs>
          <style>{`
            .garden-arc {
              fill: none;
              stroke-width: 2;
              opacity: 0.6;
              transition: stroke-width 0.3s ease, opacity 0.3s ease;
            }
            .garden-arc:hover {
              stroke-width: 3;
              opacity: 1;
            }
            .garden-emblem {
              transition: transform 0.3s ease, filter 0.3s ease;
              cursor: pointer;
            }
            .garden-emblem:hover {
              transform: scale(1.1);
              filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
            }
            .garden-text {
              font-family: 'Space Mono', monospace;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.08em;
              text-anchor: middle;
              transition: fill 0.3s ease;
            }
            .garden-name {
              font-family: 'Inter', sans-serif;
              font-size: 13px;
              font-weight: 600;
              text-anchor: middle;
            }
            @media (prefers-reduced-motion: reduce) {
              .garden-emblem, .garden-arc, .garden-text { transition: none !important; }
            }
          `}</style>
        </defs>

        {/* Central TKG */}
        <circle cx='300' cy='300' r='35' fill='#b87333' opacity='0.95' />
        <text x='300' y='305' fontFamily='Cormorant Garamond, serif' fontSize='18' fontWeight='500' fontStyle='italic' textAnchor='middle' fill='#f5f0e8'>
          TKG
        </text>

        {/* Arcs from TKG to gardens */}
        {gardens.map((garden) => (
          <g key={garden.id}>
            {/* Arc path */}
            <path
              d={`M 300 300 L ${garden.x} ${garden.y}`}
              className='garden-arc'
              stroke={garden.color}
              opacity={hoveredGarden === garden.id ? '0.8' : '0.3'}
            />

            {/* Garden emblem */}
            <g
              className='garden-emblem'
              onMouseEnter={() => setHoveredGarden(garden.id)}
              onMouseLeave={() => setHoveredGarden(null)}
              role='button'
              tabIndex={0}
            >
              <circle cx={garden.x} cy={garden.y} r='28' fill={garden.color} opacity='0.9' />
              <text className='garden-text' x={garden.x} y={garden.y + 4} fill='white'>
                {garden.id === 'hkg' ? 'HKG' : garden.id === 'bkg' ? 'BKG' : garden.id === 'naturemark' ? 'NM' : 'FG'}
              </text>
            </g>

            {/* Link count */}
            {garden.links > 0 && (
              <text x={garden.x} y={garden.y + 50} className='garden-text' fill='#1a5c5c' fontSize='10'>
                {garden.links} active link{garden.links !== 1 ? 's' : ''}
              </text>
            )}
          </g>
        ))}

        {/* Orbital ring */}
        <circle cx='300' cy='300' r='180' fill='none' stroke='#8f5a26' strokeWidth='0.75' opacity='0.15' strokeDasharray='4,6' />
      </svg>

      {/* Garden callouts */}
      <div className='gardens-callout-grid'>
        {gardens.map((garden) => (
          <div key={garden.id} className='garden-callout'>
            <h4 className='callout-name'>{garden.name}</h4>
            <p className='callout-tagline'>{garden.tagline}</p>
            {garden.links > 0 && (
              <p className='callout-link-count'>
                <strong>{garden.links}</strong> cross-links with TKG
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
