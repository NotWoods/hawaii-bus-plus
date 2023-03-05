import type { Context } from 'https://edge.netlify.com/';
import { assertEquals } from 'https://deno.land/std@0.178.0/testing/asserts.ts';
import handler from '../src/api.ts';

const mockContext = {
  async next() {
    return Response.json({
      routes: {},
      trips: [],
      info: {},
    });
  },
} as Context;
const mockContextHash =
  '8c3aabf64d6b386e3fce07fb29e30cc5aff957fcc31b2adbb6c1d8ec8e14bbbe';

Deno.test('sends 304 if eTags match', async () => {
  const request = new Request('https://app.hawaiibusplus.com/api/v1/routes', {
    headers: {
      'If-None-Match': `"${mockContextHash}"`,
    },
  });

  const response = await handler(request, mockContext);
  assertEquals(response.headers.get('ETag'), `"${mockContextHash}"`);
  assertEquals(response.status, 304);
});

Deno.test('sends 304 if any eTag is good', async () => {
  const request = new Request('https://app.hawaiibusplus.com/api/v1/routes', {
    headers: {
      'If-None-Match': '*',
    },
  });

  const response = await handler(request, mockContext);
  assertEquals(response.headers.get('ETag'), `"${mockContextHash}"`);
  assertEquals(response.status, 304);
});

Deno.test('sends 304 if eTag matches list', async () => {
  const request = new Request('https://app.hawaiibusplus.com/api/v1/routes', {
    headers: {
      'If-None-Match': `"foo", "${mockContextHash}"`,
    },
  });

  const response = await handler(request, mockContext);
  assertEquals(response.headers.get('ETag'), `"${mockContextHash}"`);
  assertEquals(response.status, 304);
});

Deno.test('sends 200 if eTag do not match', async () => {
  const request = new Request('https://app.hawaiibusplus.com/api/v1/routes');

  const response = await handler(request, mockContext);
  assertEquals(response.headers.get('ETag'), `"${mockContextHash}"`);
  assertEquals(response.status, 200);
  assertEquals(response.json(), (await mockContext.next()).json());
});
