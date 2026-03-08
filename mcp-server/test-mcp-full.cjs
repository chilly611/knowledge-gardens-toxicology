// test-mcp-full.cjs — Full integration test for toxicology MCP server
const { spawn } = require('child_process');
const path = require('path');

const server = spawn('node', [path.join(__dirname, 'build', 'index.js')], {
  stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env }
});

let buffer = '';
server.stdout.on('data', (d) => {
  buffer += d.toString();
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

function send(msg) { server.stdin.write(JSON.stringify(msg) + '\n'); }

let t = 500;
const step = (label, msg) => { setTimeout(() => { console.log('\n=== ' + label + ' ==='); send(msg); }, t); t += 2500; };

step('Initialize', { jsonrpc:'2.0', id:1, method:'initialize', params:{protocolVersion:'2024-11-05',capabilities:{},clientInfo:{name:'test',version:'1.0'}} });
step('Search: arsenic', { jsonrpc:'2.0', id:2, method:'tools/call', params:{name:'search_substances', arguments:{query:'arsenic',limit:3}} });
step('Search: PFOA (alias)', { jsonrpc:'2.0', id:3, method:'tools/call', params:{name:'search_substances', arguments:{query:'PFOA',limit:3}} });
step('Search: CAS 7440-38-2', { jsonrpc:'2.0', id:4, method:'tools/call', params:{name:'search_substances', arguments:{query:'7440-38-2',limit:3}} });
step('Details: Arsenic', { jsonrpc:'2.0', id:5, method:'tools/call', params:{name:'get_substance_details', arguments:{name:'Arsenic'}} });
step('Health: Cancer', { jsonrpc:'2.0', id:6, method:'tools/call', params:{name:'find_by_health_effect', arguments:{effect:'Cancer',limit:5}} });
step('Compare: Arsenic vs Lead', { jsonrpc:'2.0', id:7, method:'tools/call', params:{name:'compare_substances', arguments:{substance_a:'Arsenic',substance_b:'Lead'}} });
step('Water Stats', { jsonrpc:'2.0', id:8, method:'tools/call', params:{name:'get_water_stats', arguments:{limit:5}} });
step('Reg Limits: Arsenic', { jsonrpc:'2.0', id:9, method:'tools/call', params:{name:'get_regulatory_limits', arguments:{name:'Arsenic'}} });

setTimeout(() => { console.log('\n=== ALL TESTS COMPLETE ==='); server.kill(); process.exit(0); }, t + 2000);
