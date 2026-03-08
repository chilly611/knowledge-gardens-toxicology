// generate-site.js — Static site generator for Toxicology Knowledge Garden
// Generates substance pages with Schema.org JSON-LD, sitemap.xml, robots.txt
// Usage: node generate-site.js
// Requires: SUPABASE_URL, SUPABASE_ANON_KEY in env or ../../ewg-data/.env

require('dotenv').config({ path: require('path').join(__dirname, '..', '..', 'ewg-data', '.env') });
const { createClient } = require('@supabase/supabase-js');
const { writeFileSync, mkdirSync, existsSync } = require('fs');
const { join } = require('path');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const SITE_URL = 'https://theknowledgegardens.com/toxicology';
const OUT_DIR = join(__dirname, 'pages');

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildJsonLd(sub, healthEffects, classifications, regLimits, waterData, aliases) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ChemicalSubstance',
    'name': sub.name,
    'url': `${SITE_URL}/substance/${slugify(sub.name)}`,
    'description': sub.description || `${sub.name} is a chemical substance tracked in the Knowledge Gardens toxicology database.`,
  };
  if (sub.cas_number) {
    ld['identifier'] = { '@type': 'PropertyValue', 'name': 'CAS Number', 'value': sub.cas_number };
  }
  if (sub.molecular_formula) ld['molecularFormula'] = sub.molecular_formula;
  if (sub.molecular_weight) ld['molecularWeight'] = { '@type': 'QuantitativeValue', 'value': sub.molecular_weight, 'unitText': 'g/mol' };
  if (sub.smiles) ld['smiles'] = sub.smiles;
  if (sub.inchi_key) ld['inChIKey'] = sub.inchi_key;
  if (sub.pubchem_cid) ld['sameAs'] = `https://pubchem.ncbi.nlm.nih.gov/compound/${sub.pubchem_cid}`;

  if (healthEffects?.length) {
    ld['potentialAction'] = healthEffects.map(he => ({
      '@type': 'MedicalCondition', 'name': he.name,
      'evidenceLevel': he.evidence_level || 'not_classified'
    }));
  }
  if (aliases?.length) {
    ld['alternateName'] = aliases.slice(0, 20); // Cap at 20 for readability
  }
  if (regLimits?.length) {
    ld['subjectOf'] = regLimits.map(r => ({
      '@type': 'Legislation', 'name': `${r.agency} ${r.limit_type}`,
      'description': `${r.limit_value} ${r.limit_unit}`
    }));
  }
  if (waterData) {
    ld['additionalProperty'] = [];
    if (waterData.people_affected) ld['additionalProperty'].push(
      { '@type': 'PropertyValue', 'name': 'People Affected (US Drinking Water)', 'value': waterData.people_affected }
    );
    if (waterData.systems_detected) ld['additionalProperty'].push(
      { '@type': 'PropertyValue', 'name': 'Water Systems Detected', 'value': waterData.systems_detected }
    );
  }
  return ld;
}

function buildPage(sub, healthEffects, classifications, regLimits, waterData, aliases, jsonLd) {
  const title = `${sub.name}${sub.cas_number ? ` (CAS ${sub.cas_number})` : ''} — Toxicology | Knowledge Gardens`;
  const desc = sub.description || `Learn about ${sub.name} — health effects, regulatory limits, and water contamination data.`;
  const slug = slugify(sub.name);
  const canonicalUrl = `${SITE_URL}/substance/${slug}`;

  let healthHtml = '';
  if (healthEffects?.length) {
    healthHtml = `<section class="section"><h2>Health Effects</h2><ul>${healthEffects.map(h =>
      `<li><strong>${h.name}</strong> <span class="badge">${h.evidence_level}</span></li>`
    ).join('')}</ul></section>`;
  }

  let classHtml = '';
  if (classifications?.length) {
    classHtml = `<section class="section"><h2>Classifications</h2><div class="chips">${classifications.map(c =>
      `<span class="chip">${c.name}</span>`
    ).join('')}</div></section>`;
  }

  let regHtml = '';
  if (regLimits?.length) {
    regHtml = `<section class="section"><h2>Regulatory Limits</h2><table><thead><tr><th>Agency</th><th>Type</th><th>Limit</th></tr></thead><tbody>${regLimits.map(r =>
      `<tr><td>${r.agency}</td><td>${r.limit_type}</td><td>${r.limit_value} ${r.limit_unit}</td></tr>`
    ).join('')}</tbody></table></section>`;
  }

  let waterHtml = '';
  if (waterData) {
    const pa = waterData.people_affected ? `${(waterData.people_affected / 1e6).toFixed(1)}M people affected` : '';
    const sys = waterData.systems_detected ? `${waterData.systems_detected.toLocaleString()} water systems` : '';
    const st = waterData.states_detected ? `${waterData.states_detected} states` : '';
    waterHtml = `<section class="section"><h2>Water Contamination (EWG)</h2><div class="stats">${[pa,sys,st].filter(Boolean).map(s =>
      `<div class="stat">${s}</div>`
    ).join('')}</div></section>`;
  }

  let aliasHtml = '';
  if (aliases?.length) {
    aliasHtml = `<section class="section"><h2>Also Known As</h2><p class="aliases">${aliases.slice(0,30).join(', ')}</p></section>`;
  }

  let chemHtml = '';
  if (sub.molecular_formula || sub.smiles || sub.pubchem_cid) {
    chemHtml = `<section class="section"><h2>Chemistry</h2><dl>`;
    if (sub.molecular_formula) chemHtml += `<dt>Formula</dt><dd>${sub.molecular_formula}</dd>`;
    if (sub.molecular_weight) chemHtml += `<dt>Molecular Weight</dt><dd>${sub.molecular_weight} g/mol</dd>`;
    if (sub.smiles) chemHtml += `<dt>SMILES</dt><dd class="mono">${sub.smiles}</dd>`;
    if (sub.inchi_key) chemHtml += `<dt>InChI Key</dt><dd class="mono">${sub.inchi_key}</dd>`;
    if (sub.pubchem_cid) chemHtml += `<dt>PubChem</dt><dd><a href="https://pubchem.ncbi.nlm.nih.gov/compound/${sub.pubchem_cid}" rel="noopener">${sub.pubchem_cid}</a></dd>`;
    chemHtml += `</dl></section>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc.replace(/"/g, '&quot;').substring(0, 160)}">
<link rel="canonical" href="${canonicalUrl}">
<meta property="og:title" content="${sub.name} — Toxicology Database">
<meta property="og:description" content="${desc.substring(0, 200)}">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="The Knowledge Gardens">
<script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Space+Mono&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#f5f0e8;color:#2C2C2C;font-family:'Cormorant Garamond',Georgia,serif;line-height:1.6;max-width:900px;margin:0 auto;padding:2rem 1.5rem}
h1{font-size:2.2rem;color:#1A5C5C;border-bottom:2px solid #C9A84C;padding-bottom:.5rem;margin-bottom:1rem}
h2{font-size:1.4rem;color:#1A5C5C;margin:1.5rem 0 .75rem;font-weight:600}
.cas{font-family:'Space Mono',monospace;color:#71797E;font-size:.95rem}
.desc{font-size:1.1rem;margin:1rem 0 1.5rem;line-height:1.7}
.section{margin:1.5rem 0;padding:1rem;background:#FBF8F3;border:1px solid #e0d8c8;border-radius:6px}
.badge{font-family:'Space Mono',monospace;font-size:.75rem;background:#1A5C5C;color:#fff;padding:2px 8px;border-radius:3px;margin-left:.5rem}
.chip{display:inline-block;font-family:'Space Mono',monospace;font-size:.8rem;background:#C9A84C;color:#fff;padding:3px 10px;border-radius:12px;margin:3px}
.chips{display:flex;flex-wrap:wrap;gap:4px}
.stat{font-family:'Space Mono',monospace;font-size:.9rem;background:#1A5C5C;color:#FBF8F3;padding:8px 14px;border-radius:4px;display:inline-block;margin:4px}
.stats{display:flex;flex-wrap:wrap;gap:6px}
table{width:100%;border-collapse:collapse;font-size:.95rem}
th{background:#1A5C5C;color:#fff;padding:8px 12px;text-align:left;font-family:'Space Mono',monospace;font-size:.8rem}
td{padding:8px 12px;border-bottom:1px solid #e0d8c8}
dl{display:grid;grid-template-columns:auto 1fr;gap:4px 16px}
dt{font-weight:600;color:#71797E;font-family:'Space Mono',monospace;font-size:.85rem}
dd{margin:0}
.mono{font-family:'Space Mono',monospace;font-size:.8rem;word-break:break-all}
.aliases{font-size:.9rem;color:#71797E;line-height:1.8}
a{color:#1A5C5C}
.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #C9A84C;font-size:.8rem;color:#71797E;font-family:'Space Mono',monospace}
.nav{margin-bottom:1.5rem;font-family:'Space Mono',monospace;font-size:.85rem}
.nav a{color:#1A5C5C;text-decoration:none}
.nav a:hover{text-decoration:underline}
</style>
</head>
<body>
<nav class="nav"><a href="../index.html">Knowledge Gardens</a> / <a href="../index.html">Toxicology</a> / ${sub.name}</nav>
<h1>${sub.name}</h1>
${sub.cas_number ? `<p class="cas">CAS ${sub.cas_number}</p>` : ''}
${sub.description ? `<p class="desc">${sub.description}</p>` : ''}
${chemHtml}${healthHtml}${regHtml}${waterHtml}${classHtml}${aliasHtml}
<footer class="footer">
<p>Data sources: EWG Tap Water Database, PubChem, EPA | The Knowledge Gardens &copy; 2026</p>
<p>This page contains structured data (JSON-LD) for search engines and AI agents.</p>
</footer>
</body>
</html>`;
}

// === Main generator ===
async function generate() {
  console.log('Fetching substances...');
  const { data: substances } = await supabase.from('substances').select('*').order('name');
  console.log(`Got ${substances.length} substances`);

  const pages = [];

  for (let i = 0; i < substances.length; i++) {
    const sub = substances[i];
    const slug = slugify(sub.name);

    // Fetch related data
    const [heRes, clRes, rlRes, wdRes, alRes] = await Promise.all([
      supabase.from('substance_health_effects').select('health_effects(name), evidence_level').eq('substance_id', sub.id),
      supabase.from('substance_classifications').select('classifications(name)').eq('substance_id', sub.id),
      supabase.from('regulatory_limits').select('agency, limit_type, limit_value, limit_unit').eq('substance_id', sub.id),
      supabase.from('water_data').select('*').eq('substance_id', sub.id).limit(1),
      supabase.from('substance_aliases').select('alias').eq('substance_id', sub.id).limit(30),
    ]);

    const healthEffects = heRes.data?.map(h => ({ name: h.health_effects?.name, evidence_level: h.evidence_level })).filter(h => h.name) || [];
    const classifications = clRes.data?.map(c => ({ name: c.classifications?.name })).filter(c => c.name) || [];
    const regLimits = rlRes.data || [];
    const waterData = wdRes.data?.[0] || null;
    const aliases = alRes.data?.map(a => a.alias) || [];

    const jsonLd = buildJsonLd(sub, healthEffects, classifications, regLimits, waterData, aliases);
    const html = buildPage(sub, healthEffects, classifications, regLimits, waterData, aliases, jsonLd);

    const pageDir = join(OUT_DIR, slug);
    if (!existsSync(pageDir)) mkdirSync(pageDir, { recursive: true });
    writeFileSync(join(pageDir, 'index.html'), html, 'utf8');

    pages.push({ slug, name: sub.name, cas: sub.cas_number, desc: sub.description });
    if ((i + 1) % 50 === 0) process.stdout.write(`\r  ${i + 1}/${substances.length}...`);
  }
  console.log(`\nGenerated ${pages.length} substance pages`);

  // === SITEMAP.XML ===
  const today = new Date().toISOString().split('T')[0];
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  sitemap += `  <url><loc>${SITE_URL}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>\n`;
  for (const p of pages) {
    sitemap += `  <url><loc>${SITE_URL}/substance/${p.slug}</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>\n`;
  }
  sitemap += `</urlset>`;
  writeFileSync(join(OUT_DIR, '..', 'sitemap.xml'), sitemap, 'utf8');
  console.log(`Sitemap: ${pages.length + 1} URLs`);

  // === ROBOTS.TXT ===
  const robots = `# The Knowledge Gardens — Toxicology Database
# AI crawlers welcome — structured data available on all pages

User-agent: *
Allow: /

# AI Crawlers — explicitly allowed
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  writeFileSync(join(OUT_DIR, '..', 'robots.txt'), robots, 'utf8');
  console.log('robots.txt written');

  // === INDEX PAGE ===
  const indexLd = {
    '@context': 'https://schema.org',
    '@type': 'DataCatalog',
    'name': 'The Knowledge Gardens — Toxicology Database',
    'description': 'Comprehensive toxicology database with health effects, regulatory limits, and water contamination data for 329 chemical substances.',
    'url': SITE_URL,
    'provider': { '@type': 'Organization', 'name': 'XR Workers / The Knowledge Gardens' },
    'dataset': pages.slice(0, 50).map(p => ({
      '@type': 'Dataset', 'name': p.name, 'url': `${SITE_URL}/substance/${p.slug}`
    }))
  };

  const indexRows = pages.map(p => {
    const d = p.desc ? p.desc.substring(0, 80) : '';
    return `<tr><td><a href="pages/${p.slug}/">${p.name}</a></td><td class="mono">${p.cas || '—'}</td><td>${d}</td></tr>`;
  }).join('\n');

  const indexHtml = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Toxicology Database — The Knowledge Gardens</title>
<meta name="description" content="Explore 329 chemical substances with health effects, regulatory limits, and US drinking water contamination data.">
<link rel="canonical" href="${SITE_URL}/">
<script type="application/ld+json">${JSON.stringify(indexLd)}</script>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Space+Mono&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#f5f0e8;color:#2C2C2C;font-family:'Cormorant Garamond',Georgia,serif;max-width:1000px;margin:0 auto;padding:2rem 1.5rem}
h1{font-size:2.4rem;color:#1A5C5C;margin-bottom:.5rem}
.subtitle{color:#71797E;font-family:'Space Mono',monospace;font-size:.9rem;margin-bottom:2rem}
input{width:100%;padding:10px 14px;border:2px solid #C9A84C;border-radius:6px;font-size:1rem;font-family:'Cormorant Garamond',serif;background:#FBF8F3;margin-bottom:1.5rem}
table{width:100%;border-collapse:collapse}
th{background:#1A5C5C;color:#fff;padding:8px 12px;text-align:left;font-family:'Space Mono',monospace;font-size:.8rem;position:sticky;top:0}
td{padding:6px 12px;border-bottom:1px solid #e0d8c8;font-size:.95rem}
tr:hover{background:#FBF8F3}
a{color:#1A5C5C}
.mono{font-family:'Space Mono',monospace;font-size:.8rem}
.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #C9A84C;font-size:.8rem;color:#71797E;font-family:'Space Mono',monospace}
</style></head>
<body>
<h1>Toxicology Database</h1>
<p class="subtitle">The Knowledge Gardens &mdash; ${pages.length} substances | Schema.org JSON-LD | AI-discoverable</p>
<input type="text" id="filter" placeholder="Filter substances..." oninput="filterTable(this.value)">
<table id="tbl"><thead><tr><th>Substance</th><th>CAS</th><th>Description</th></tr></thead>
<tbody>${indexRows}</tbody></table>
<footer class="footer"><p>Data: EWG, PubChem, EPA | MCP Server available | <a href="sitemap.xml">Sitemap</a></p></footer>
<script>
function filterTable(q){const r=document.querySelectorAll('#tbl tbody tr');q=q.toLowerCase();r.forEach(r=>{r.style.display=r.textContent.toLowerCase().includes(q)?'':'none'})}
</script>
</body></html>`;
  writeFileSync(join(OUT_DIR, '..', 'index.html'), indexHtml, 'utf8');
  console.log('Index page written');
  console.log('\\nDone! All files in:', join(OUT_DIR, '..'));
}

generate().catch(console.error);
