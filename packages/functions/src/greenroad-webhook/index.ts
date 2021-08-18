import { HTTPError } from '@hawaii-bus-plus/gotrue';
import { createHandler } from '../../shared';
import { jsonResponse } from '../../shared/response';
import { GreenRoadMessage } from './interface';

function btoa(string: string) {
  return Buffer.from(string).toString('base64');
}

const BASIC = /^\s*Basic\s+([A-Za-z0-9+/=]+)\s*$/;

const corpHeaders = {
  'Cross-Origin-Resource-Policy': 'cross-origin',
};

const forbiddenHeaders = {
  ...corpHeaders,
  'WWW-Authenticate': 'Basic realm="GreenRoad Webhook"',
};

function validatedBody(rawBody: string | null | undefined) {
  if (rawBody == undefined) {
    throw new HTTPError(
      400,
      'Missing body in POST request. Expected JSON array.',
    );
  }

  const body = JSON.parse(rawBody) as unknown;
  if (!Array.isArray(body)) {
    throw new HTTPError(400, `Expected JSON array, received ${typeof body}`);
  }

  return body as GreenRoadMessage[];
}

/**
 * Webhook for GreenRoad GPS API.
 */
export const handler = createHandler('POST', (event, _context) => {
  const expectedUsername = process.env['GREENROAD_USER_NAME'];
  const expectedPassword = process.env['GREENROAD_PASSWORD'];
  if (!expectedUsername || !expectedPassword) {
    return jsonResponse(
      501,
      {
        error: 'Login information not yet set up',
      },
      corpHeaders,
    );
  }

  const headerMatch = event.headers?.['authorization']?.match(BASIC);
  if (!headerMatch) {
    return jsonResponse(
      401,
      {
        error: 'Missing required "Authorization" header',
      },
      forbiddenHeaders,
    );
  }

  const [, encodedAuth] = headerMatch;
  const encodedExpected = btoa(`${expectedUsername}:${expectedPassword}`);

  if (encodedAuth !== encodedExpected) {
    return jsonResponse(
      401,
      {
        error: 'Incorrect username or password',
      },
      forbiddenHeaders,
    );
  }

  const body = validatedBody(event.body);
  console.log(body);

  return jsonResponse(
    202,
    {
      message: `Accepted ${body.length} messages`,
      keys: body.map((message) => Object.keys(message).join(', ')),
    },
    corpHeaders,
  );
});
