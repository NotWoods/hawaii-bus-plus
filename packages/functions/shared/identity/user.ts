import GoTrue, { User, Token } from 'gotrue-js';

export class TokenUser extends User {
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
}
