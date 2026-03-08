// serve-docs.js — Simple static server for API docs
// Usage: node serve-docs.js
// Then open http://localhost:3333/docs.html

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3333;
const DIR = __dirname;
const MIME = { '.html': 'text/html', '.yaml': 'text/yaml', '.yml': 'text/yaml',
  '.json': 'application/json', '.js': 'text/javascript', '.css': 'text/css', '.md': 'text/markdown' };

http.createServer((req, res) => {
  const file = path.join(DIR, req.url === '/' ? 'docs.html' : req.url);
  const ext = path.extname(file);
  res.setHeader('Access-Control-Allow-Origin', '*');
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`API docs: http://localhost:${PORT}/docs.html`));
