// migrate-ewg.js — ETL: flat ewg_contaminants → normalized schema
// Usage: node migrate-ewg.js
// Reads from ewg_contaminants_enriched.json + Supabase ewg_contaminants
// Writes to: substances, substance_aliases, substance_classifications,
//            substance_health_effects, regulatory_limits, water_data, source_documents

require('dotenv').config({ path: require('path').join(__dirname, '..', '..', 'ewg-data', '.env') });
const { createClient } = require('@supabase/supabase-js');
const { readFileSync } = require('fs');
const { join } = require('path');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Health keyword → health_effects name mapping
const HEALTH_MAP = {
  'cancer': 'Cancer',
  'liver': 'Liver Damage',
  'kidney': 'Kidney Damage',
  'nervous system': 'Nervous System',
  'reproductive': 'Reproductive',
  'developmental': 'Developmental',
  'endocrine': 'Endocrine Disruption',
  'immune': 'Immune System',
  'cardiovascular': 'Cardiovascular',
  'heart': 'Cardiovascular',
  'respiratory': 'Respiratory',
  'lung': 'Respiratory',
  'gastrointestinal': 'Gastrointestinal',
  'skin': 'Skin',
  'eye': 'Eye',
  'blood': 'Blood',
  'bone': 'Bone',
  'thyroid': 'Thyroid',
  'adrenal': 'Adrenal',
  'genotoxicity': 'Genotoxicity',
  'mutagenic': 'Genotoxicity',
  'dna': 'Genotoxicity',
};

// EWG boolean flags → classification name mapping
const CLASS_MAP = {
  is_pfas: 'PFAS',
  is_disinfection_byproduct: 'Disinfection Byproduct',
  is_pesticide: 'Pesticide',
  is_industrial: 'Industrial Solvent',
  is_naturally_occurring: 'Naturally Occurring',
  is_radiological: 'Radiological',
};

async function loadLookups() {
  const { data: classData } = await supabase.from('classifications').select('id, name');
  const classMap = new Map(classData.map(c => [c.name, c.id]));

  const { data: heData } = await supabase.from('health_effects').select('id, name');
  const heMap = new Map(heData.map(h => [h.name, h.id]));

  const { data: erData } = await supabase.from('exposure_routes').select('id, name');
  const erMap = new Map(erData.map(e => [e.name, e.id]));

  return { classMap, heMap, erMap };
}

function parseEwgGuideline(raw) {
  if (!raw) return null;
  // Clean up parsing artifacts like "1 ppbThe"
  const match = raw.match(/([\d.]+)\s*(ppb|ppm|mg\/L|μg\/L|ug\/L|pCi\/L|mrem)/i);
  if (match) return { value: parseFloat(match[1]), unit: match[2].toLowerCase() };
  return null;
}

function parseLegalLimit(raw) {
  if (!raw) return null;
  const match = String(raw).match(/([\d.]+)\s*(ppb|ppm|mg\/L|μg\/L|ug\/L|pCi\/L|mrem)/i);
  if (match) return { value: parseFloat(match[1]), unit: match[2].toLowerCase() };
  return null;
}

function matchHealthEffects(keywords, heMap) {
  const matched = new Set();
  for (const kw of (keywords || [])) {
    const kwLower = kw.toLowerCase();
    for (const [pattern, effectName] of Object.entries(HEALTH_MAP)) {
      if (kwLower.includes(pattern) && heMap.has(effectName)) {
        matched.add(effectName);
      }
    }
  }
  return [...matched];
}

async function migrate() {
  console.log('Loading lookups...');
  const { classMap, heMap, erMap } = await loadLookups();
  console.log(`Classifications: ${classMap.size}, Health Effects: ${heMap.size}, Exposure Routes: ${erMap.size}`);

  // Load enriched JSON (has more data than the DB flat table)
  const raw = JSON.parse(readFileSync(join(__dirname, '..', '..', 'ewg-data', 'data', 'ewg_contaminants_enriched.json'), 'utf8'));
  const reviewed = raw.reviewed_contaminants || [];
  const enriched = raw.all_contaminants_enriched || [];
  console.log(`JSON: ${enriched.length} enriched, ${reviewed.length} reviewed`);

  // Build reviewed map
  const reviewedMap = new Map(reviewed.map(r => [r.name, r]));

  // Merge into unified list
  const allContaminants = new Map();
  for (const c of enriched) allContaminants.set(c.name, { ...c, reviewed: reviewedMap.get(c.name) || null });
  for (const r of reviewed) {
    if (!allContaminants.has(r.name)) allContaminants.set(r.name, { ...r, reviewed: r });
  }
  console.log(`Total unique contaminants: ${allContaminants.size}`);

  const drinkingWaterRouteId = erMap.get('drinking_water');
  let inserted = 0, errors = 0;

  for (const [name, c] of allContaminants) {
    const rev = c.reviewed;
    const desc = rev?.description || (typeof c.description === 'string' && c.description.length > 20 ? c.description : null);

    // 1. Insert substance
    const { data: sub, error: subErr } = await supabase.from('substances').upsert({
      name,
      description: desc,
      cas_number: null, // Will be enriched in Chunk 2 via PubChem
    }, { onConflict: 'name', ignoreDuplicates: false }).select('id').single();

    if (subErr) { console.error(`ERR substance ${name}:`, subErr.message); errors++; continue; }
    const subId = sub.id;

    // 2. Classifications from boolean flags
    const classIds = [];
    for (const [flag, className] of Object.entries(CLASS_MAP)) {
      if (c[flag] && classMap.has(className)) classIds.push(classMap.get(className));
    }
    if (classIds.length) {
      const rows = classIds.map(cid => ({ substance_id: subId, classification_id: cid }));
      await supabase.from('substance_classifications').upsert(rows, { onConflict: 'substance_id,classification_id' });
    }

    // 3. Health effects from keywords
    const effects = matchHealthEffects(c.health_keywords, heMap);
    if (c.cancer_class) effects.push('Cancer'); // If cancer class exists, ensure Cancer is linked
    const uniqueEffects = [...new Set(effects)];
    if (uniqueEffects.length) {
      const rows = uniqueEffects.filter(e => heMap.has(e)).map(e => ({
        substance_id: subId,
        health_effect_id: heMap.get(e),
        evidence_level: c.cancer_class ? 'probable' : 'possible',
        evidence_source: 'EWG Tap Water Database',
      }));
      if (rows.length) await supabase.from('substance_health_effects').upsert(rows, { onConflict: 'substance_id,health_effect_id' });
    }

    // 4. Regulatory limits (EWG guideline + legal limit)
    const ewgParsed = parseEwgGuideline(c.ewg_guideline);
    if (ewgParsed) {
      // Delete existing EWG guideline for this substance, then insert fresh
      await supabase.from('regulatory_limits').delete().match({ substance_id: subId, agency: 'EWG' });
      await supabase.from('regulatory_limits').insert({
        substance_id: subId, agency: 'EWG', limit_type: 'guideline',
        limit_value: ewgParsed.value, limit_unit: ewgParsed.unit,
        source_url: c.detail_url || c.url || null,
      });
    }
    const legalParsed = parseLegalLimit(c.legal_limit);
    if (legalParsed) {
      await supabase.from('regulatory_limits').delete().match({ substance_id: subId, agency: 'EPA' });
      await supabase.from('regulatory_limits').insert({
        substance_id: subId, agency: 'EPA', limit_type: 'MCL',
        limit_value: legalParsed.value, limit_unit: legalParsed.unit,
      });
    }

    // 5. Water data
    const peopleAffected = c.people_affected ? parseInt(String(c.people_affected).replace(/[^\d]/g, '')) : null;
    const systemsDetected = c.systems_detected ? parseInt(String(c.systems_detected).replace(/[^\d]/g, '')) : null;
    const statesDetected = c.states_detected ? parseInt(String(c.states_detected).replace(/[^\d]/g, '')) : null;
    const statesTested = c.states_tested ? parseInt(String(c.states_tested).replace(/[^\d]/g, '')) : null;

    if (peopleAffected || systemsDetected || statesDetected) {
      await supabase.from('water_data').upsert({
        substance_id: subId,
        states_detected: statesDetected,
        states_tested: statesTested,
        systems_detected: systemsDetected,
        people_affected: peopleAffected ? peopleAffected * 1000000 : null, // stored as millions in EWG
        source: 'ewg_tapwater',
        scraped_at: new Date().toISOString(),
      }, { onConflict: 'substance_id' }).select();
    }

    // 6. Exposure route (all EWG substances are drinking water)
    if (drinkingWaterRouteId) {
      await supabase.from('substance_exposures').upsert({
        substance_id: subId,
        exposure_route_id: drinkingWaterRouteId,
        description: 'Detected in drinking water (EWG Tap Water Database)',
      }, { onConflict: 'substance_id,exposure_route_id' });
    }

    // 7. Source document (EWG page as provenance)
    const fullText = rev?.full_text_paragraphs?.join('\n\n') || c.content_paragraphs?.join('\n\n') || null;
    if (fullText && fullText.length > 50) {
      const { data: srcDoc } = await supabase.from('source_documents').upsert({
        source_name: 'EWG Tap Water Database',
        source_url: c.detail_url || c.url || null,
        document_type: 'contaminant_profile',
        content_text: fullText,
      }, { onConflict: 'source_url' }).select('id').single();
      if (srcDoc) {
        await supabase.from('substance_sources').upsert({
          substance_id: subId,
          source_document_id: srcDoc.id,
          data_extracted: { source: 'ewg', scraped: true },
        }, { onConflict: 'substance_id,source_document_id' });
      }
    }

    inserted++;
    if (inserted % 25 === 0) process.stdout.write(`\r  ${inserted}/${allContaminants.size}...`);
  }

  console.log(`\n\nDone! Inserted: ${inserted}, Errors: ${errors}`);

  // Verify counts
  const tables = ['substances','substance_classifications','substance_health_effects','regulatory_limits','water_data','source_documents','substance_sources','substance_exposures'];
  for (const t of tables) {
    const { count } = await supabase.from(t).select('*', { count: 'exact', head: true });
    console.log(`  ${t}: ${count} rows`);
  }
}

migrate().catch(console.error);
