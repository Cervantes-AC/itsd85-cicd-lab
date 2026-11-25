import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app, { add } from '../src/app.js';

let server;
let baseUrl;

// Port 0 picks any free port, and the server closes when the tests finish.
before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://localhost:${server.address().port}`;
});

after(() => server.close());

test('add() returns the correct result', () => {
  assert.equal(add(2, 3), 5);
  assert.equal(add(-1, 1.5), 0.5);
});

test('GET /health returns 200 and the correct JSON', async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: 'ok',
    version: process.env.APP_VERSION || 'dev',
  });
});

test('GET /api/add adds two numbers', async () => {
  const response = await fetch(`${baseUrl}/api/add?a=2&b=3`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { result: 5 });
});

test('GET /api/add returns 400 for invalid inputs', async () => {
  const invalidQueries = [
    'a=two&b=3',
    'a=2&b=three',
    'a=2',
    '',
    'a=&b=3',
    'a=%20&b=3',
    'a=Infinity&b=3',
    'a=1&a=2&b=3',
  ];

  for (const query of invalidQueries) {
    const response = await fetch(`${baseUrl}/api/add?${query}`);
    assert.equal(response.status, 400, `expected 400 for "${query}"`);
    assert.ok((await response.json()).error);
  }
});

test('GET / returns the Hello World homepage', async () => {
  const response = await fetch(`${baseUrl}/`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.match(await response.text(), /<h1>Hello, World!<\/h1>/);
});
