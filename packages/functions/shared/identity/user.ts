import GoTrue, { Token } from 'gotrue-js';
import { User } from './baseuser.js';

function atob(base64: string) {
  return Buffer.from(base64, 'base64').toString('ascii');
}

function urlBase64Decode(str: string) {
  // From https://jwt.io/js/jwt.js
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw 'Illegal base64url string!';
  }

  const result = atob(output);
  try {
    return decodeURIComponent(escape(result));
  } catch (error: unknown) {
    return result;
  }
}

export class NodeUser extends User {
  _processTokenResponse(tokenResponse: Token) {
    this.token = tokenResponse;
    try {
      const claims = JSON.parse(
        urlBase64Decode(tokenResponse.access_token.split('.')[1])
      ) as { exp: number };
      this.token.expires_at = claims.exp * 1000;
    } catch (error: unknown) {
      console.error(
        new Error(
          `Gotrue-js: Failed to parse tokenResponse claims: ${error as string}`
        )
      );
    }
  }
}

export class TokenUser extends NodeUser {
  constructor(auth: GoTrue, accessToken: string, refreshToken?: string) {
    // This is enough for gotrue to work with.
    // expires_at is populated using the access token.
    const tokenResponse: Partial<Token> = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
    super(auth.api, tokenResponse, auth.audience);
  }

  /**
   * Refresh the access token using the refresh token.
   * If refresh token isn't set, an error is thrown early.
   */
  _refreshToken(refreshToken?: string) {
    if (!refreshToken) {
      throw new Error('Missing refresh token, cannot refresh expired JWT');
    }
    return super._refreshToken(refreshToken);
  }

  _processTokenResponse(tokenResponse: Token) {
    this.token = tokenResponse;
    try {
      const claims = JSON.parse(
        urlBase64Decode(tokenResponse.access_token.split('.')[1])
      ) as { exp: number };
      this.token.expires_at = claims.exp * 1000;
    } catch (error: unknown) {
      console.error(
        new Error(
          `Gotrue-js: Failed to parse tokenResponse claims: ${error as string}`
        )
      );
    }
  }
}
