'use client';

import { useEffect, useState, useMemo } from 'react';
import { getCertifiedClaims, getCases } from '@/lib/queries-tox';
import type { CertifiedClaimRow, LegalCase } from '@/lib/types-tox';
import { slug as slugify } from '@/lib/queries-tox';

/**
 * Force-directed-ish network visualization for Tidepool landing.
 * Animated SVG with 30-40 nodes, edges colored by claim status.
 * Tier 1: Static position layout + CSS keyframe drift animations.
 */

interface Node {
  id: string;
  label: string;
  type: 'substance' | 'endpoint' | 'source' | 'case';
  status?: 'certified' | 'provisional' | 'contested';
  metadata?: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  animationDuration: string;
  animationDelay: string;
}

interface Edge {
  sourceId: string;
  targetId: string;
  status: string;
  strength: number;
}

// Fake force-layout: scatter nodes with some spacing
function generateNodePositions(count: number): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = [];
  const centerX = 800;
  const centerY = 600;
  const spread = 400;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const distance = spread * (0.5 + Math.random() * 0.5);
    const x = centerX + distance * Math.cos(angle) + (Math.random() - 0.5) * 100;
    const y = centerY + distance * Math.sin(angle) + (Math.random() - 0.5) * 100;
    positions.push({ x: Math.max(80, Math.min(1520, x)), y: Math.max(80, Math.min(1120, y)) });
  }
  return positions;
}

const STATUS_COLORS: Record<string, { edge: string; glow: string }> = {
  certified: { edge: '#2ea4a3', glow: 'rgba(46, 164, 163, 0.4)' },
  provisional: { edge: '#d68843', glow: 'rgba(214, 136, 67, 0.4)' },
  contested: { edge: '#e83759', glow: 'rgba(232, 55, 89, 0.4)' },
};

const NODE_COLORS = {
  substance: '#2ea4a3', // bioluminescent teal (var(--teal))
  endpoint: '#ffb166',   // peach (var(--peach))
  source: '#e8eae8',     // pale white (var(--ink) in dark theme is light)
  case: '#d68843',       // peach-deep (var(--peach-deep))
};

export default function EvidenceGraph() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Fetch data and build graph
  useEffect(() => {
    async function loadGraph() {
      try {
        const [claims, cases] = await Promise.all([
          getCertifiedClaims(),
          getCases(),
        ]);

        const nodeMap = new Map<string, Node>();
        const edgeList: Edge[] = [];
        const edgeSet = new Set<string>();

        // Add substance nodes (main focal points)
        const substanceMap = new Map<string, { name: string; count: Record<string, number> }>();
        for (const claim of claims) {
          if (!substanceMap.has(claim.substance_id)) {
            substanceMap.set(claim.substance_id, {
              name: claim.substance_name,
              count: {},
            });
          }
          const entry = substanceMap.get(claim.substance_id)!;
          entry.count[claim.status] = (entry.count[claim.status] || 0) + 1;
        }

        let nodeIndex = 0;
        const positions = generateNodePositions(substanceMap.size + claims.length + cases.length + 10);

        for (const [subId, { name }] of substanceMap) {
          const pos = positions[nodeIndex++];
          nodeMap.set(subId, {
            id: subId,
            label: name,
            type: 'substance',
            x: pos.x,
            y: pos.y,
            radius: 32,
            color: NODE_COLORS.substance,
            metadata: `${claims.filter((c) => c.substance_id === subId).length} CLAIMS`,
            animationDuration: `${12 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 2}s`,
          });
        }

        // Add endpoint nodes
        const endpointMap = new Map<string, { count: number; category: string }>();
        for (const claim of claims) {
          if (!endpointMap.has(claim.endpoint_name)) {
            endpointMap.set(claim.endpoint_name, { count: 0, category: claim.endpoint_category });
          }
          const entry = endpointMap.get(claim.endpoint_name)!;
          entry.count += 1;
        }

        const topEndpoints = Array.from(endpointMap.entries())
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 12);

        for (const [endpointName, { count, category }] of topEndpoints) {
          const endpointId = `ep-${slugify(endpointName)}`;
          const pos = positions[nodeIndex++];
          nodeMap.set(endpointId, {
            id: endpointId,
            label: endpointName,
            type: 'endpoint',
            x: pos.x,
            y: pos.y,
            radius: 20,
            color: NODE_COLORS.endpoint,
            metadata: `${count} LINKED`,
            animationDuration: `${13 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 2}s`,
          });

          // Add edges from substances to endpoints
          for (const claim of claims.filter((c) => c.endpoint_name === endpointName)) {
            const edgeKey = `${claim.substance_id}-${endpointId}`;
            if (!edgeSet.has(edgeKey)) {
              edgeSet.add(edgeKey);
              edgeList.push({
                sourceId: claim.substance_id,
                targetId: endpointId,
                status: claim.status,
                strength: 0.3,
              });
            }
          }
        }

        // Add case nodes (diamond shape, special styling)
        const casesSlice = cases.slice(0, 5);
        for (const legalCase of casesSlice) {
          const caseId = `case-${legalCase.id}`;
          const pos = positions[nodeIndex++];
          nodeMap.set(caseId, {
            id: caseId,
            label: legalCase.short_name || legalCase.caption.substring(0, 20),
            type: 'case',
            x: pos.x,
            y: pos.y,
            radius: 24,
            color: NODE_COLORS.case,
            metadata: `${legalCase.filed_year || '?'}`,
            animationDuration: `${14 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 2}s`,
          });
        }

        // Add source constellation nodes (small pinpricks)
        const sourceCount = Math.min(8, claims.length);
        for (let i = 0; i < sourceCount; i++) {
          const sourceId = `source-${i}`;
          const pos = positions[nodeIndex++];
          nodeMap.set(sourceId, {
            id: sourceId,
            label: `Source`,
            type: 'source',
            x: pos.x,
            y: pos.y,
            radius: 4,
            color: NODE_COLORS.source,
            metadata: '',
            animationDuration: `${15 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 2}s`,
          });
        }

        setNodes(Array.from(nodeMap.values()));
        setEdges(edgeList);
        setMounted(true);
      } catch (error) {
        console.error('EvidenceGraph load error:', error);
        setMounted(true);
      }
    }

    loadGraph();
  }, []);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Generate drift animations CSS
  const generateKeyframes = () => {
    const styles: Record<string, string> = {};
    for (let i = 0; i < 20; i++) {
      const key = `drift${i}`;
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      styles[key] = `
        @keyframes ${key} {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${offsetX}px, ${offsetY}px); }
        }
      `;
    }
    return styles;
  };

  const keyframes = useMemo(() => generateKeyframes(), []);

  // Render helper: get animation class name
  const getAnimationKey = (index: number) => {
    const animIndex = index % Object.keys(keyframes).length;
    return Object.keys(keyframes)[animIndex];
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a2826 0%, #0f1c1a 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Keyframes injection */}
      <style>
        {`
          ${Object.values(keyframes).join('\n')}

          .evidence-graph-node {
            cursor: pointer;
            transition: filter 0.3s ease;
          }

          .evidence-graph-node:hover {
            filter: drop-shadow(0 0 20px currentColor);
          }

          .evidence-graph-edge {
            stroke-width: 1.5;
            opacity: 0.6;
            transition: opacity 0.3s ease;
          }

          .evidence-graph-edge:hover {
            opacity: 0.9;
          }

          .evidence-graph-label {
            font-family: var(--font-display);
            font-style: italic;
            font-size: 13px;
            fill: white;
            text-anchor: middle;
            dominant-baseline: middle;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
            pointer-events: none;
          }

          .evidence-graph-metadata {
            font-family: var(--font-mono);
            font-size: 9px;
            fill: rgba(255, 255, 255, 0.6);
            text-anchor: middle;
            dominant-baseline: middle;
            pointer-events: none;
            letter-spacing: 0.1em;
          }

          @media (prefers-reduced-motion: reduce) {
            .evidence-graph-animated {
              animation: none !important;
            }
          }
        `}
      </style>

      {/* SVG Canvas */}
      <svg
        width="1600"
        height="1200"
        viewBox="0 0 1600 1200"
        className="absolute inset-0"
        style={{
          maxWidth: '100%',
          height: 'auto',
          filter: 'drop-shadow(0 0 60px rgba(91, 192, 190, 0.08))',
        }}
      >
        <defs>
          {/* Gradient definitions for edges */}
          <linearGradient id="grad-certified" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5BC0BE" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#5BC0BE" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="grad-provisional" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8A988" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#E8A988" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="grad-contested" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E83759" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#E83759" stopOpacity="0.2" />
          </linearGradient>

          {/* Radial glow filters */}
          <filter id="glow-substance" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-endpoint" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges (connections) */}
        {edges.map((edge) => {
          const sourceNode = nodes.find((n) => n.id === edge.sourceId);
          const targetNode = nodes.find((n) => n.id === edge.targetId);
          if (!sourceNode || !targetNode) return null;

          const statusColor = STATUS_COLORS[edge.status] || STATUS_COLORS.certified;
          const gradId = edge.status === 'certified' ? 'grad-certified' : edge.status === 'provisional' ? 'grad-provisional' : 'grad-contested';

          return (
            <line
              key={`edge-${edge.sourceId}-${edge.targetId}`}
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke={`url(#${gradId})`}
              className="evidence-graph-edge"
              style={{
                strokeDasharray: '6 4',
                animation: 'line-flow 8s linear infinite',
              }}
            />
          );
        })}

        {/* Ghost particles — ambient orbiting motion */}
        {[...Array(3)].map((_, i) => {
          const startX = 400 + Math.random() * 800;
          const startY = 300 + Math.random() * 600;
          const duration = 15 + i * 3;
          return (
            <circle
              key={`ghost-${i}`}
              cx={startX}
              cy={startY}
              r="2"
              fill="rgba(46, 164, 163, 0.2)"
              style={{
                animation: `drift ${duration}s ease-in-out infinite`,
                animationDelay: `${i * 2}s`,
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, idx) => {
          const animKey = getAnimationKey(idx);
          const isHovered = hoveredNode === node.id;

          return (
            <g
              key={node.id}
              className="evidence-graph-animated"
              style={{
                animation: prefersReducedMotion ? 'none' : `${animKey} ${node.animationDuration} ease-in-out infinite ${node.animationDelay}`,
              }}
            >
              {/* Halo background for substance nodes */}
              {node.type === 'substance' && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius + 20}
                  fill={node.color}
                  opacity={isHovered ? 0.15 : 0.06}
                  style={{
                    transition: 'opacity 0.3s ease',
                  }}
                />
              )}

              {/* Main node circle or diamond */}
              {node.type === 'case' ? (
                // Diamond shape for cases
                <polygon
                  className="evidence-graph-node"
                  points={`${node.x},${node.y - node.radius} ${node.x + node.radius},${node.y} ${node.x},${node.y + node.radius} ${node.x - node.radius},${node.y}`}
                  fill={node.color}
                  filter="url(#glow-endpoint)"
                  opacity={isHovered ? 1 : 0.8}
                  style={{
                    cursor: 'pointer',
                    animation: `node-blip 2s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 0.5}s`,
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => {
                    if (node.type === 'case') {
                      window.location.href = `/case/${slugify(node.label)}`;
                    }
                  }}
                />
              ) : (
                // Circle for other nodes
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  fill={node.color}
                  filter={node.type === 'substance' ? 'url(#glow-substance)' : node.type === 'endpoint' ? 'url(#glow-endpoint)' : undefined}
                  opacity={isHovered ? 1 : node.type === 'source' ? 0.4 : 0.85}
                  className="evidence-graph-node"
                  style={{
                    cursor: 'pointer',
                    animation: `node-blip 2.2s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 0.8}s`,
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => {
                    if (node.type === 'substance') {
                      window.location.href = `/compound/${slugify(node.label)}`;
                    } else if (node.type === 'case') {
                      window.location.href = `/case/${slugify(node.label)}`;
                    }
                  }}
                />
              )}

              {/* Labels — only show for larger nodes or when hovered */}
              {(isHovered || node.type === 'substance' || node.type === 'case') && (
                <>
                  <text
                    x={node.x}
                    y={node.y - 8}
                    className="evidence-graph-label"
                    style={{
                      opacity: isHovered ? 1 : 0.7,
                    }}
                  >
                    {node.label}
                  </text>
                  {node.metadata && (
                    <text
                      x={node.x}
                      y={node.y + 12}
                      className="evidence-graph-metadata"
                      style={{
                        opacity: isHovered ? 1 : 0.5,
                      }}
                    >
                      {node.metadata}
                    </text>
                  )}
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
