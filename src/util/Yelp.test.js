import Yelp from './Yelp';
afterEach(() => { delete global.fetch; });
test('search values are encoded and requests stay on the local proxy', async () => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ businesses: [] }) }));
  expect(await Yelp.search('fish & chips', 'A#B', 'rating')).toEqual([]);
  const url = new URL(global.fetch.mock.calls[0][0], 'http://localhost');
  expect(url.pathname).toBe('/api/yelp');
  expect(url.searchParams.get('term')).toBe('fish & chips');
  expect(url.searchParams.get('location')).toBe('A#B');
});
test.each([{ ok: false, payload: { error: 'Search failed' } }, { ok: true, payload: {} }])(
  'bad API payload rejects instead of returning undefined', async ({ ok, payload }) => {
    global.fetch = jest.fn(() => Promise.resolve({ ok, json: () => Promise.resolve(payload) }));
    await expect(Yelp.search('', '', '')).rejects.toThrow();
  }
);
