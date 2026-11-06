const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const json = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
};
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

async function staticFile(req, res, pathname, root) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { return json(res, 400, { error: 'Invalid path' }); }
  const file = path.resolve(root, '.' + decoded);
  if (!file.startsWith(root + path.sep) || decoded.split('/').some(part => part.startsWith('.'))) {
    return json(res, 404, { error: 'Not found' });
  }
  try {
    const contents = await fs.readFile(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    res.end(contents);
  } catch { json(res, 404, { error: 'Not found' }); }
}

function createServer({ apiKey = process.env.YELP_API_KEY, fetchImpl = global.fetch } = {}) {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/yelp') {
      if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });
      if (!apiKey) return json(res, 503, { error: 'Configure YELP_API_KEY on the server.' });
      const query = new URLSearchParams();
      for (const key of ['term', 'location', 'sort_by']) query.set(key, url.searchParams.get(key) || '');
      try {
        const response = await fetchImpl('https://api.yelp.com/v3/businesses/search?' + query, {
          headers: { Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) return json(res, 502, { error: 'Yelp search failed. Please try again.' });
        const data = await response.json();
        if (!Array.isArray(data.businesses)) throw new Error('Invalid response');
        return json(res, 200, { businesses: data.businesses });
      } catch { return json(res, 502, { error: 'Yelp search failed. Please try again.' }); }
    }
    if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });
    return staticFile(req, res, url.pathname === '/' ? '/index.html' : url.pathname, path.join(__dirname, 'build'));
  });
}
module.exports = { createServer };
if (require.main === module) createServer().listen(Number(process.env.PORT || 3001), '127.0.0.1', () => {
  console.log('Ravenous server ready; open http://127.0.0.1:' + (process.env.PORT || 3001));
});
