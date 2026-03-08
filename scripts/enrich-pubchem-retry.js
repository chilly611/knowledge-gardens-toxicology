// enrich-pubchem-retry.js — Retry enrichment for substances not found by primary name
// Tries: abbreviation in parentheses, name without parenthetical, simplified name
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', 'ewg-data', '.env') });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const PUBCHEM_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
const DELAY_MS = 600;
const CAS_REGEX = /^\d{1,7}-\d{2}-\d$/;
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
async function fetchJSON(url) { const r = await fetch(url); if (!r.ok) return null; return r.json(); }

// Name variants to try
function getVariants(name) {
  const variants = [];
  // Try abbreviation in parentheses: "Perfluorooctanoic acid (PFOA)" → "PFOA"
  const parenMatch = name.match(/\(([^)]+)\)$/);
  if (parenMatch) {
    variants.push(parenMatch[1]);
    variants.push(name.replace(/\s*\([^)]+\)$/, ''));
  }
  // Try name before comma: "Isopropyltoluene, p-" → "p-Isopropyltoluene"
  const commaMatch = name.match(/^(.+),\s*(.+)$/);
  if (commaMatch) variants.push(`${commaMatch[2]}${commaMatch[1]}`);
  // Specific mappings for known problem names
  const MANUAL = {
    'Chromium (hexavalent)': 'Chromium(VI)',
    'Chromium (total)': 'Chromium',
    'Chromium-6': 'Chromium(VI)',
    'Cyanide (free)': 'Hydrogen cyanide',
    'Mercury (inorganic)': 'Mercury',
    'Asbestos': 'Chrysotile',
  };
  if (MANUAL[name]) variants.push(MANUAL[name]);
  return variants;
}

async function retry() {
  const { data: missing } = await supabase.from('substances')
    .select('id, name').is('pubchem_cid', null).order('name');
  console.log(`Substances missing PubChem data: ${missing.length}`);
  let found = 0, still_missing = 0;

  for (const sub of missing) {
    const variants = getVariants(sub.name);
    if (!variants.length) { still_missing++; continue; }

    let props = null;
    let usedName = null;
    for (const v of variants) {
      const encoded = encodeURIComponent(v);
      const url = `${PUBCHEM_BASE}/compound/name/${encoded}/property/MolecularFormula,MolecularWeight,IUPACName,CanonicalSMILES,InChIKey/JSON`;
      const data = await fetchJSON(url);
      await sleep(DELAY_MS);
      if (data?.PropertyTable?.Properties?.[0]) {
        props = data.PropertyTable.Properties[0];
        usedName = v;
        break;
      }
    }

    if (!props) { still_missing++; continue; }

    // Get CAS from synonyms
    const synUrl = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(usedName)}/synonyms/JSON`;
    const synData = await fetchJSON(synUrl);
    await sleep(DELAY_MS);
    const syns = synData?.InformationList?.Information?.[0]?.Synonym || [];
    const cas = syns.find(s => CAS_REGEX.test(s)) || null;

    const update = {
      pubchem_cid: props.CID,
      molecular_formula: props.MolecularFormula,
      molecular_weight: parseFloat(props.MolecularWeight),
      iupac_name: props.IUPACName,
      smiles: props.CanonicalSMILES || props.ConnectivitySMILES,
      inchi_key: props.InChIKey,
    };
    if (cas) update.cas_number = cas;
    const { error } = await supabase.from('substances').update(update).eq('id', sub.id);
    if (error) { console.log(`  CAS conflict for ${sub.name} (via ${usedName})`); }
    else { found++; console.log(`  FOUND: ${sub.name} → ${usedName} (CID: ${props.CID})`); }

    // Add synonyms as aliases
    const filtered = syns.filter(s => !CAS_REGEX.test(s) && s.length < 100
      && !s.startsWith('DTXCID') && !s.startsWith('DTXSID')
      && !s.startsWith('CHEBI:') && !s.startsWith('RefChem:')
    ).slice(0, 20);
    if (filtered.length) {
      await supabase.from('substance_aliases').delete().eq('substance_id', sub.id).eq('alias_type', 'synonym');
      await supabase.from('substance_aliases').insert(filtered.map(s => ({
        substance_id: sub.id, alias: s, alias_type: 'synonym',
      })));
    }
  }

  console.log(`\nRetry complete: Found ${found}, Still missing: ${still_missing}`);
  const { count } = await supabase.from('substances').select('*', { count: 'exact', head: true }).not('pubchem_cid', 'is', null);
  console.log(`Total enriched: ${count}/329`);
}

retry().catch(console.error);
