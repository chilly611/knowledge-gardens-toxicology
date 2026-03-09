// execute-migration.js — Run 002_cases.sql against Supabase
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://vlezoyalutexenbnzzui.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function run() {
  const sqlPath = path.join(__dirname, '..', 'migrations', '002_cases.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Executing 002_cases.sql migration...');
  console.log(`SQL length: ${sql.length} chars`);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({})
  });

  // Use the SQL endpoint directly via pg-meta
  const sqlRes = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
