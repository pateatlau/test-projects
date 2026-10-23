import assert from 'node:assert/strict';
import { test } from 'node:test';
import express from 'express';
import request from 'supertest';
import { app, errorHandler } from '../src/app.js';
import { parsePort } from '../src/config.js';

test('GET /health returns the health status without a framework header', async () => {
  const response = await request(app)
    .get('/health')
    .expect('Content-Type', /json/)
    .expect(200);

  assert.deepEqual(response.body, { status: 'ok' });
  assert.equal(response.headers['x-powered-by'], undefined);
});

test('unknown routes return a consistent JSON 404', async () => {
  await request(app)
    .get('/missing')
    .expect('Content-Type', /json/)
    .expect(404, { error: { message: 'Not found' } });
});

test('unsupported methods return a JSON 404', async () => {
  await request(app)
    .post('/health')
    .expect(404, { error: { message: 'Not found' } });
});

test('unexpected errors are logged but internal details are not returned', async (context) => {
  const logging = context.mock.method(console, 'error', () => {});
  const failingApp = express();
  const failure = new Error('Internal diagnostic details');

  failingApp.get('/failure', () => {
    throw failure;
  });
  failingApp.use(errorHandler);

  await request(failingApp)
    .get('/failure')
    .expect('Content-Type', /json/)
    .expect(500, { error: { message: 'Internal server error' } });

  assert.equal(logging.mock.callCount(), 1);
  assert.equal(logging.mock.calls[0]?.arguments[1], failure);
});

test('PORT defaults to 3000 and accepts valid port boundaries', () => {
  assert.equal(parsePort(undefined), 3000);
  assert.equal(parsePort('1'), 1);
  assert.equal(parsePort('3001'), 3001);
  assert.equal(parsePort('65535'), 65535);
});

test('PORT rejects empty, malformed, and out-of-range values', () => {
  for (const value of [
    '',
    ' ',
    '0',
    '-1',
    '65536',
    '1.5',
    '3e3',
    '0x100',
    '3000abc',
    'NaN',
  ]) {
    assert.throws(
      () => parsePort(value),
      /PORT must be an integer between 1 and 65535/,
    );
  }
});
