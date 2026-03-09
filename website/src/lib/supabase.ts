import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── Type definitions matching our Postgres schema ──

export interface Substance {
  id: string;
  name: string;
  cas_number: string | null;
  iupac_name: string | null;
  molecular_formula: string | null;
  molecular_weight: number | null;
  smiles: string | null;
  inchi_key: string | null;
  pubchem_cid: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface HealthEffect {
  id: string;
  name: string;
  description: string | null;
  icd_code: string | null;
}

export interface Classification {
  id: string;
  name: string;
  description: string | null;
  classification_type: string;
}

export interface RegulatoryLimit {
  id: string;
  substance_id: string;
  agency: string;
  limit_type: string;
  limit_value: number | null;
  limit_unit: string | null;
  notes: string | null;
}

export interface WaterData {
  substance_id: string;
  states_detected: number | null;
  states_tested: number | null;
  systems_detected: number | null;
  people_affected: number | null;
  detection_period: string | null;
}

export interface SubstanceAlias {
  alias: string;
  alias_type: string;
}

// ── Data fetching functions ──

export async function getAllSubstances(): Promise<Substance[]> {
  const { data, error } = await supabase
    .from('substances')
    .select('*')
    .order('name');
  if (error) throw error;
  return data || [];
}

export async function getSubstanceBySlug(slug: string) {
  const name = slug.replace(/-/g, ' ');
  const { data, error } = await supabase
    .from('substances')
    .select('*')
    .ilike('name', name)
    .single();
  if (error) throw error;
  return data as Substance;
}

export async function getSubstanceDetails(substanceId: string) {
  const { data, error } = await supabase
    .rpc('get_substance_details', { p_substance_id: substanceId });
  if (error) throw error;
  return data;
}

export async function searchSubstances(query: string) {
  const { data, error } = await supabase
    .rpc('search_substances_hybrid', { search_query: query });
  if (error) throw error;
  return data || [];
}

export async function getSubstanceHealthEffects(substanceId: string) {
  const { data, error } = await supabase
    .from('substance_health_effects')
    .select('*, health_effects(*)')
    .eq('substance_id', substanceId);
  if (error) throw error;
  return data || [];
}

export async function getSubstanceClassifications(substanceId: string): Promise<Classification[]> {
  const { data, error } = await supabase
    .from('substance_classifications')
    .select('classifications(*)')
    .eq('substance_id', substanceId);
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((d: any) => d.classifications);
}

export async function getSubstanceRegulations(substanceId: string) {
  const { data, error } = await supabase
    .from('regulatory_limits')
    .select('*')
    .eq('substance_id', substanceId);
  if (error) throw error;
  return data || [];
}

export async function getSubstanceWaterData(substanceId: string) {
  const { data, error } = await supabase
    .from('water_data')
    .select('*')
    .eq('substance_id', substanceId)
    .maybeSingle();
  if (error) throw error;
  return data as WaterData | null;
}

export async function getSubstanceAliases(substanceId: string) {
  const { data, error } = await supabase
    .from('substance_aliases')
    .select('alias, alias_type')
    .eq('substance_id', substanceId)
    .limit(30);
  if (error) throw error;
  return data || [];
}

export async function getAllHealthEffects() {
  const { data, error } = await supabase
    .from('health_effects')
    .select('*')
    .order('name');
  if (error) throw error;
  return data || [];
}

export async function getAllClassifications() {
  const { data, error } = await supabase
    .from('classifications')
    .select('*')
    .order('name');
  if (error) throw error;
  return data || [];
}

export function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
