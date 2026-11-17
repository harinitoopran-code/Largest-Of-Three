// Tiny web app (no dependencies) so the program can run in a container / Kubernetes
const http = require('http');
const { largest } = require('./largest');
const PORT = process.env.PORT || 3000;

const page = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Largest of Three Numbers</title>
<style>body{font-family:sans-serif;max-width:420px;margin:60px auto}input,button{padding:8px;margin:4px 0;width:100%;box-sizing:border-box}</style></head>
<body><h2>Largest of Three Numbers</h2>
<input id="a" type="number" placeholder="First number">
<input id="b" type="number" placeholder="Second number">
<input id="c" type="number" placeholder="Third number">
<button onclick="go()">Find Largest</button><h3 id="out"></h3>
<script>
async function go(){
  const q=['a','b','c'].map(i=>i+'='+document.getElementById(i).value).join('&');
  const r=await fetch('/api/largest?'+q); const d=await r.json();
  document.getElementById('out').textContent=d.error?d.error:'Largest: '+d.largest;
}
</script></body></html>`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const json = (code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
  if (url.pathname === '/api/health') return json(200, { status: 'ok' });
  if (url.pathname === '/api/largest') {
    const nums = ['a', 'b', 'c'].map((k) => url.searchParams.get(k)).map((v) => (v === null || v === '' ? NaN : Number(v)));
    try { return json(200, { numbers: nums, largest: largest(...nums) }); }
    catch (e) { return json(400, { error: e.message }); }
  }
  res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(page);
});
if (require.main === module) server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = server;
