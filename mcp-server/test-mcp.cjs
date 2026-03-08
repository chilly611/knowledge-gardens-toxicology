// test-mcp.js — Integration test for toxicology MCP server
const { spawn } = require('child_process');
const path = require('path');

const server = spawn('node', [path.join(__dirname, 'build', 'index.js')], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env }
});

let buffer = '';
server.stdout.on('data', (d) => {
  buffer += d.toString();
  // Parse JSON-RPC responses (newline-delimited)
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';
  for (const line of lines) {
    if (line.trim()) {
      try { console.log('RESPONSE:', JSON.stringify(JSON.parse(line), null, 2)); }
      catch { console.log('RAW:', line); }
    }
  }
});
server.stderr.on('data', (d) => console.error('STDERR:', d.toString().trim()));

function send(msg) {
  const json = JSON.stringify(msg);
  server.stdin.write(`${json}\n`);
}

setTimeout(() => {
  console.log('\n=== TEST 1: Initialize ===');
  send({
    jsonrpc: '2.0', id: 1, method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'test-client', version: '1.0' }
    }
  });
}, 500);

setTimeout(() => {
  console.log('\n=== TEST 2: List Tools ===');
  send({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
}, 2000);

setTimeout(() => {
  console.log('\n=== TEST 3: Search for Arsenic ===');
  send({
    jsonrpc: '2.0', id: 3, method: 'tools/call',
    params: { name: 'search_substances', arguments: { query: 'arsenic', limit: 3 } }
  });
}, 3500);

setTimeout(() => {
  console.log('\n=== TEST 4: Get Water Stats ===');
  send({
    jsonrpc: '2.0', id: 4, method: 'tools/call',
    params: { name: 'get_water_stats', arguments: { limit: 5 } }
  });
}, 5000);

setTimeout(() => {
  console.log('\n=== TESTS COMPLETE ===');
  server.kill();
  process.exit(0);
}, 8000);
