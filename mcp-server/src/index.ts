#!/usr/bin/env node
/**
 * Knowledge Gardens — Toxicology MCP Server
 * Exposes toxicology database tools via Model Context Protocol
 * For use with Claude Desktop, Cursor, Windsurf, etc.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env from server directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// === MCP Server Setup ===
const server = new McpServer(
  { name: 'toxicology-mcp', version: '1.0.0' },
  { capabilities: { logging: {} } }
);

// === TOOL 1: search_substances ===
server.registerTool(
  'search_substances',
  {
    title: 'Search Substances',
    description: 'Search the toxicology database for chemical substances by name, CAS number, trade name, or keyword. Handles misspellings via fuzzy matching. Returns ranked results with match type.',
    inputSchema: {
      query: z.string().describe('Search query — substance name, CAS number, trade name, or keyword'),
      limit: z.number().optional().default(10).describe('Max results to return (default: 10)')
    }
  },
  async ({ query, limit }) => {
    const { data, error } = await supabase.rpc('search_substances_hybrid', {
      query_text: query,
      max_results: limit || 10
    });
    if (error) return { content: [{ type: 'text' as const, text: `Search error: ${error.message}` }] };
    if (!data?.length) return { content: [{ type: 'text' as const, text: `No substances found for "${query}"` }] };
    const results = data.map((s: any) =>
      `• ${s.name}${s.cas_number ? ` (CAS: ${s.cas_number})` : ''} [${s.match_type}${s.score ? `, score: ${s.score.toFixed(3)}` : ''}]` +
      (s.description ? `\n  ${s.description.substring(0, 150)}` : '')
    ).join('\n\n');
    return {
      content: [{ type: 'text' as const, text: `Found ${data.length} substance(s) for "${query}":\n\n${results}` }]
    };
  }
);

// === TOOL 2: get_substance_details ===
server.registerTool(
  'get_substance_details',
  {
    title: 'Get Substance Details',
    description: 'Get comprehensive details about a specific substance including health effects, regulatory limits, water contamination data, classifications, and aliases. Use the exact substance name from search results.',
    inputSchema: {
      name: z.string().describe('Exact substance name (from search results)')
    }
  },
  async ({ name }) => {
    const { data, error } = await supabase.rpc('get_substance_details', {
      substance_name: name
    });
    if (error) return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }] };
    if (!data) return { content: [{ type: 'text' as const, text: `Substance "${name}" not found` }] };
    const s = data;
    let text = `# ${s.name}\n`;
    if (s.cas_number) text += `CAS: ${s.cas_number}\n`;
    if (s.molecular_formula) text += `Formula: ${s.molecular_formula} | MW: ${s.molecular_weight}\n`;
    if (s.description) text += `\n${s.description}\n`;

    if (s.health_effects?.length) {
      text += `\n## Health Effects\n`;
      s.health_effects.forEach((h: any) => { text += `• ${h.name} (${h.evidence_level})\n`; });
    }
    if (s.classifications?.length) {
      text += `\n## Classifications\n${s.classifications.map((c: any) => c.name).join(', ')}\n`;
    }
    if (s.regulatory_limits?.length) {
      text += `\n## Regulatory Limits\n`;
      s.regulatory_limits.forEach((r: any) => {
        text += `• ${r.agency} ${r.limit_type}: ${r.limit_value} ${r.limit_unit}\n`;
      });
    }
    if (s.water_data) {
      const w = s.water_data;
      text += `\n## Water Contamination (EWG)\n`;
      if (w.people_affected) text += `• People affected: ${(w.people_affected / 1e6).toFixed(1)}M\n`;
      if (w.systems_detected) text += `• Water systems: ${w.systems_detected.toLocaleString()}\n`;
      if (w.states_detected) text += `• States detected: ${w.states_detected}\n`;
    }
    if (s.aliases?.length) {
      text += `\n## Also Known As\n${s.aliases.join(', ')}\n`;
    }
    return { content: [{ type: 'text' as const, text }] };
  }
);

// === TOOL 3: find_by_health_effect ===
server.registerTool(
  'find_by_health_effect',
  {
    title: 'Find Substances by Health Effect',
    description: 'Find all substances linked to a specific health effect (e.g., "Cancer", "Liver Damage", "Endocrine Disruption", "Nervous System", "Thyroid", "Reproductive"). Returns substances with evidence levels.',
    inputSchema: {
      effect: z.string().describe('Health effect name (e.g., Cancer, Liver Damage, Thyroid)'),
      limit: z.number().optional().default(20).describe('Max results (default: 20)')
    }
  },
  async ({ effect, limit }) => {
    const { data, error } = await supabase.rpc('find_by_health_effect', {
      effect_name: effect,
      max_results: limit || 20
    });
    if (error) return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }] };
    if (!data?.length) return { content: [{ type: 'text' as const, text: `No substances found for health effect "${effect}"` }] };

    const lines = data.map((s: any) =>
      `• ${s.name}${s.cas_number ? ` (CAS: ${s.cas_number})` : ''} — evidence: ${s.evidence_level}`
    ).join('\n');
    return {
      content: [{ type: 'text' as const, text: `${data.length} substance(s) linked to "${effect}":\n\n${lines}` }]
    };
  }
);

// === TOOL 4: compare_substances ===
server.registerTool(
  'compare_substances',
  {
    title: 'Compare Substances',
    description: 'Compare two substances side-by-side showing health effects, regulatory limits, water contamination data, and classifications.',
    inputSchema: {
      substance_a: z.string().describe('First substance name'),
      substance_b: z.string().describe('Second substance name')
    }
  },
  async ({ substance_a, substance_b }) => {
    const { data, error } = await supabase.rpc('compare_substances', {
      name_a: substance_a,
      name_b: substance_b
    });
    if (error) return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }] };
    if (!data?.length) return { content: [{ type: 'text' as const, text: `Could not find one or both substances` }] };

    let text = `# Comparison: ${substance_a} vs ${substance_b}\n\n`;
    const items = Array.isArray(data) ? data : [data];
    for (const s of items) {
      if (!s) continue;
      text += `## ${s.name}\n`;
      if (s.cas_number) text += `CAS: ${s.cas_number}\n`;
      if (s.health_effects?.length) text += `Health effects: ${s.health_effects.map((h: any) => typeof h === 'string' ? h : h.name).join(', ')}\n`;
      if (s.classifications?.length) text += `Classifications: ${s.classifications.map((c: any) => typeof c === 'string' ? c : c.name).join(', ')}\n`;
      if (s.regulatory_limits?.length) {
        text += `Regulatory limits:\n`;
        s.regulatory_limits.forEach((r: any) => { text += `  • ${r.agency} ${r.limit_type}: ${r.limit_value} ${r.limit_unit}\n`; });
      }
      if (s.water_data?.people_affected) text += `People affected: ${(s.water_data.people_affected / 1e6).toFixed(1)}M\n`;
      text += '\n';
    }
    return { content: [{ type: 'text' as const, text }] };
  }
);

// === TOOL 5: get_water_stats ===
server.registerTool(
  'get_water_stats',
  {
    title: 'Get Water Contamination Statistics',
    description: 'Get top contaminants by number of people affected in US drinking water. Shows which substances impact the most people.',
    inputSchema: {
      limit: z.number().optional().default(15).describe('Number of top contaminants to return (default: 15)')
    }
  },
  async ({ limit }) => {
    const { data, error } = await supabase.rpc('get_water_stats', {
      min_people_affected: 0,
      max_results: limit || 15
    });
    if (error) return { content: [{ type: 'text' as const, text: `Error: ${error.message}` }] };
    if (!data?.length) return { content: [{ type: 'text' as const, text: 'No water data available' }] };
    const lines = data.map((s: any, i: number) =>
      `${i + 1}. ${s.name} — ${(s.people_affected / 1e6).toFixed(1)}M people` +
      (s.systems_detected ? ` | ${s.systems_detected.toLocaleString()} systems` : '') +
      (s.states_detected ? ` | ${s.states_detected} states` : '')
    ).join('\n');
    return {
      content: [{ type: 'text' as const, text: `Top ${data.length} water contaminants by people affected:\n\n${lines}` }]
    };
  }
);

// === TOOL 6: get_regulatory_limits ===
server.registerTool(
  'get_regulatory_limits',
  {
    title: 'Get Regulatory Limits',
    description: 'Get regulatory limits for a substance from all agencies (EPA, WHO, EWG, etc.). Shows MCLs, guidelines, and health goals.',
    inputSchema: {
      name: z.string().describe('Substance name to look up regulatory limits for')
    }
  },
  async ({ name }) => {
    // Find substance first
    const { data: sub } = await supabase.from('substances').select('id').ilike('name', name).limit(1).single();
    if (!sub) return { content: [{ type: 'text' as const, text: `Substance "${name}" not found` }] };
    const { data: limits } = await supabase.from('regulatory_limits')
      .select('*').eq('substance_id', sub.id);

    if (!limits?.length) return { content: [{ type: 'text' as const, text: `No regulatory limits found for "${name}"` }] };

    let text = `# Regulatory Limits: ${name}\n\n`;
    limits.forEach((r: any) => {
      text += `• ${r.agency} — ${r.limit_type}: ${r.limit_value} ${r.limit_unit}`;
      if (r.source_url) text += ` [source](${r.source_url})`;
      if (r.notes) text += `\n  Note: ${r.notes}`;
      text += '\n';
    });
    return { content: [{ type: 'text' as const, text }] };
  }
);

// === TOOL 7: list_health_effects ===
server.registerTool(
  'list_health_effects',
  {
    title: 'List Health Effects',
    description: 'List all tracked health effect categories and how many substances are linked to each.',
    inputSchema: {}
  },
  async () => {
    const { data } = await supabase.from('health_effects').select('id, name, description');
    if (!data?.length) return { content: [{ type: 'text' as const, text: 'No health effects found' }] };
    // Get counts per effect
    const counts: Record<string, number> = {};
    for (const he of data) {
      const { count } = await supabase.from('substance_health_effects')
        .select('*', { count: 'exact', head: true }).eq('health_effect_id', he.id);
      counts[he.name] = count || 0;
    }

    const lines = data
      .map((h: any) => `• ${h.name} (${counts[h.name]} substances) — ${h.description}`)
      .sort((a: string, b: string) => {
        const ca = parseInt(a.match(/\((\d+)/)?.[1] || '0');
        const cb = parseInt(b.match(/\((\d+)/)?.[1] || '0');
        return cb - ca;
      })
      .join('\n');
    return { content: [{ type: 'text' as const, text: `Health Effect Categories:\n\n${lines}` }] };
  }
);

// === STARTUP ===
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Knowledge Gardens Toxicology MCP Server running on stdio');
  console.error(`Connected to: ${SUPABASE_URL}`);
  console.error('Tools: search_substances, get_substance_details, find_by_health_effect, compare_substances, get_water_stats, get_regulatory_limits, list_health_effects');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
