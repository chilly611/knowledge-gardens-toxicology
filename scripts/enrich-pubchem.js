// enrich-pubchem.js — Chunk 2: Enrich substances with PubChem data
// Queries PubChem PUG REST API for CAS, SMILES, InChI, molecular weight, synonyms
// Usage: node enrich-pubchem.js
// Rate limit: PubChem allows 5 requests/second — we do 2/sec to be safe

require('dotenv').config({ path: require('path').join(__dirname, '..', '..', 'ewg-data', '.env') });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const PUBCHEM_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
const DELAY_MS = 600; // ~1.6 req/sec to stay well under PubChem's 5/sec limit
const CAS_REGEX = /^\d{1,7}-\d{2}-\d$/;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

async function getProperties(name) {
  const encoded = encodeURIComponent(name);
  const url = `${PUBCHEM_BASE}/compound/name/${encoded}/property/MolecularFormula,MolecularWeight,IUPACName,CanonicalSMILES,InChIKey/JSON`;
  const data = await fetchJSON(url);
  if (!data?.PropertyTable?.Properties?.[0]) return null;
  const p = data.PropertyTable.Properties[0];
  return {
    pubchem_cid: p.CID,
    molecular_formula: p.MolecularFormula,
    molecular_weight: parseFloat(p.MolecularWeight),
    iupac_name: p.IUPACName,
    smiles: p.CanonicalSMILES || p.ConnectivitySMILES,
    inchi_key: p.InChIKey,
  };
}

async function getSynonyms(name) {
  const encoded = encodeURIComponent(name);
  const url = `${PUBCHEM_BASE}/compound/name/${encoded}/synonyms/JSON`;
  const data = await fetchJSON(url);
  if (!data?.InformationList?.Information?.[0]?.Synonym) return { cas: null, synonyms: [] };
  const syns = data.InformationList.Information[0].Synonym;
  const cas = syns.find(s => CAS_REGEX.test(s)) || null;
  // Take top 20 synonyms, skip IDs like DTXCID, CHEBI, etc.
  const filtered = syns.filter(s =>
    !CAS_REGEX.test(s) &&
    !s.startsWith('DTXCID') && !s.startsWith('DTXSID') &&
    !s.startsWith('CHEBI:') && !s.startsWith('RefChem:') &&
    !s.startsWith('UNII-') && s.length < 100
  ).slice(0, 20);
  return { cas, synonyms: filtered };
}

async function fixClassifications(substanceId, props) {
  // Remove incorrect EWG boolean-based classifications
  // and re-classify based on PubChem data + substance name
  // This fixes issues like Arsenic being tagged as PFAS
  const { data: currentClasses } = await supabase
    .from('substance_classifications')
    .select('classification_id, classifications(name)')
    .eq('substance_id', substanceId);

  const { data: allClasses } = await supabase.from('classifications').select('id, name');
  const classMap = new Map(allClasses.map(c => [c.name, c.id]));

  // Determine correct classifications based on molecular formula and name
  const formula = (props?.molecular_formula || '').toUpperCase();
  const name = (props?._name || '').toLowerCase();
  const correctClasses = new Set();

  // PFAS: must contain both C and F
  if (formula.includes('C') && formula.includes('F')) correctClasses.add('PFAS');
  // Heavy metals
  const metals = ['arsenic','lead','mercury','cadmium','chromium','barium','beryllium','thallium','antimony','selenium','uranium','manganese','copper','zinc','nickel','cobalt','molybdenum','vanadium'];
  if (metals.some(m => name.includes(m))) correctClasses.add('Heavy Metal');
  // Radiological
  const radio = ['radium','radon','uranium','gross alpha','gross beta','tritium','strontium-90','combined radium'];
  if (radio.some(r => name.includes(r))) correctClasses.add('Radiological');

  // Remove incorrect PFAS tags
  for (const cc of (currentClasses || [])) {
    const clsName = cc.classifications?.name;
    if (clsName === 'PFAS' && !correctClasses.has('PFAS')) {
      await supabase.from('substance_classifications')
        .delete().match({ substance_id: substanceId, classification_id: cc.classification_id });
    }
  }
  // Add missing correct classifications
  for (const cls of correctClasses) {
    if (classMap.has(cls)) {
      await supabase.from('substance_classifications')
        .upsert({ substance_id: substanceId, classification_id: classMap.get(cls) },
          { onConflict: 'substance_id,classification_id' });
    }
  }
}

async function enrich() {
  // Get all substances that haven't been enriched yet (no pubchem_cid)
  const { data: substances, error } = await supabase
    .from('substances')
    .select('id, name, pubchem_cid, cas_number')
    .order('name');

  if (error) { console.error('Failed to load substances:', error.message); return; }
  
  const toEnrich = substances.filter(s => !s.pubchem_cid);
  const alreadyDone = substances.length - toEnrich.length;
  console.log(`Total: ${substances.length}, Already enriched: ${alreadyDone}, To enrich: ${toEnrich.length}`);

  let enriched = 0, notFound = 0, errors = 0;
  const notFoundNames = [];

  for (const sub of toEnrich) {
    try {
      // 1. Get properties
      const props = await getProperties(sub.name);
      await sleep(DELAY_MS);

      if (!props) {
        notFound++;
        notFoundNames.push(sub.name);
        if (notFound <= 5) console.log(`  NOT FOUND: ${sub.name}`);
        // Still fix classifications even without PubChem data
        await fixClassifications(sub.id, { _name: sub.name });
        continue;
      }

      // 2. Get synonyms + CAS
      const { cas, synonyms } = await getSynonyms(sub.name);
      await sleep(DELAY_MS);

      // 3. Update substance record
      const updateData = {
        pubchem_cid: props.pubchem_cid,
        molecular_formula: props.molecular_formula,
        molecular_weight: props.molecular_weight,
        iupac_name: props.iupac_name,
        smiles: props.smiles,
        inchi_key: props.inchi_key,
      };
      if (cas) updateData.cas_number = cas;

      const { error: updateErr } = await supabase
        .from('substances').update(updateData).eq('id', sub.id);
      if (updateErr) { console.error(`  UPDATE ERR ${sub.name}:`, updateErr.message); errors++; continue; }

      // 4. Insert aliases (synonyms)
      if (synonyms.length) {
        const aliasRows = synonyms.map(s => ({
          substance_id: sub.id,
          alias: s,
          alias_type: 'synonym',
        }));
        // Delete existing synonyms, then insert fresh
        await supabase.from('substance_aliases').delete()
          .eq('substance_id', sub.id).eq('alias_type', 'synonym');
        await supabase.from('substance_aliases').insert(aliasRows);
      }

      // 5. Fix classifications
      await fixClassifications(sub.id, { ...props, _name: sub.name });

      enriched++;
      if (enriched % 10 === 0) process.stdout.write(`\r  ${enriched}/${toEnrich.length} enriched...`);

    } catch (err) {
      console.error(`\n  ERROR ${sub.name}:`, err.message);
      errors++;
      await sleep(2000); // Back off on error
    }
  }

  console.log(`\n\n=== ENRICHMENT COMPLETE ===`);
  console.log(`Enriched: ${enriched}`);
  console.log(`Not found in PubChem: ${notFound}`);
  console.log(`Errors: ${errors}`);

  if (notFoundNames.length) {
    console.log(`\nNot found (${notFoundNames.length}):`);
    notFoundNames.forEach(n => console.log(`  - ${n}`));
  }

  // Verify
  const { count: withCAS } = await supabase.from('substances')
    .select('*', { count: 'exact', head: true }).not('cas_number', 'is', null);
  const { count: withCID } = await supabase.from('substances')
    .select('*', { count: 'exact', head: true }).not('pubchem_cid', 'is', null);
  const { count: aliasCount } = await supabase.from('substance_aliases')
    .select('*', { count: 'exact', head: true });
  console.log(`\nSubstances with CAS: ${withCAS}/329`);
  console.log(`Substances with PubChem CID: ${withCID}/329`);
  console.log(`Total aliases: ${aliasCount}`);
}

enrich().catch(console.error);
