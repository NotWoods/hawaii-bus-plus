import type { Context } from 'https://edge.netlify.com/';
import { encode } from 'https://deno.land/std@0.178.0/encoding/hex.ts';

async function getHash(data: ArrayBuffer) {
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', data));
  // to hex hash
  return new TextDecoder().decode(encode(hash));
}

/**
 * Returns a function that checks if the given ETag matches the stored ETags.
 * Used with the If-None-Match header, which is a comma-separated list of ETags.
 */
function matchEntityTags(entityTags: string | null): (eTag: string) => boolean {
  if (entityTags == undefined) {
    return () => false;
  } else if (entityTags === '*') {
    return () => true;
  } else {
    const storedTags = new Set(entityTags.split(',').map((h) => h.trim()));
    return (eTag) =>
      storedTags.has(`"${eTag}"`) || storedTags.has(`"${eTag}-df"`);
  }
}

export default async function handler(request: Request, context: Context) {
  const apiResponse = await context.next({
    sendConditionalRequest: true,
  });
  const apiData = await apiResponse.arrayBuffer();

  const matchETag = matchEntityTags(
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    request.headers.get('if-none-match') ||
      request.headers.get('x-if-none-match'),
  );
  const entityTag = await getHash(apiData);

  const headers = new Headers(apiResponse.headers);
  headers.set('ETag', `"${entityTag}"`);

  if (matchETag(entityTag)) {
    return new Response(null, {
      status: 304,
      headers,
    });
  } else {
    headers.set('Content-Type', 'application/json');
    return new Response(apiData, {
      status: 200,
      headers,
    });
  }
}
