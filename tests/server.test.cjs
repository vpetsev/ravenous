const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../server.cjs');
async function run(options, callback) {
  const server = createServer(options).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try { await callback('http://127.0.0.1:' + server.address().port); }
  finally { await new Promise(resolve => server.close(resolve)); }
}
test('proxy preserves reserved query characters and keeps credentials upstream', async () => {
  let sent;
  await run({ apiKey: 'test-only-secret', fetchImpl: async (url, options) => {
    sent = { url, options }; return { ok: true, json: async () => ({ businesses: [] }) };
  } }, async base => {
    const response = await fetch(base + '/api/yelp?' + new URLSearchParams({ term: 'fish & chips', location: 'A#B', sort_by: 'rating' }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { businesses: [] });
    assert.equal(new URL(sent.url).searchParams.get('term'), 'fish & chips');
    assert.equal(new URL(sent.url).searchParams.get('location'), 'A#B');
    assert.equal(sent.options.headers.Authorization, 'Bearer test-only-secret');
  });
});
test('missing credentials return a configuration error', async () => {
  await run({ apiKey: '' }, async base => assert.equal((await fetch(base + '/api/yelp')).status, 503));
});
test('upstream failures produce a safe error and private source is not served', async () => {
  await run({ apiKey: 'test-only-secret', fetchImpl: async () => { throw new Error('private upstream details'); } }, async base => {
    const response = await fetch(base + '/api/yelp');
    assert.equal(response.status, 502);
    assert.doesNotMatch(await response.text(), /private upstream|test-only-secret/);
    assert.equal((await fetch(base + '/server.cjs')).status, 404);
  });
});
