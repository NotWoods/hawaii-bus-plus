import { RequestInit } from 'node-fetch';
import { Admin } from './admin.js';
import API, { JSONHTTPError } from './api/index.js';
import { RequestMap, UserData, Token, UserRequest } from './api/interface.js';

function atob(base64: string) {
  return Buffer.from(base64, 'base64').toString('ascii');
}

const ExpiryMargin = 60 * 1000;
const refreshPromises: { [refresh_token: string]: Promise<string> } = {};
const forbiddenUpdateAttributes = { api: 1, token: 1, audience: 1, url: 1 };

export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  audience?: string;
}

export function formatError(error: unknown) {
  if (error instanceof JSONHTTPError && error.json) {
    const json = error.json as {
      msg?: string;
      error?: string;
      error_description?: string;
    };
    if (json.msg) {
      error.message = json.msg;
    } else if (json.error) {
      error.message = `${json.error}: ${json.error_description!}`;
    }
  }
  return error;
}

export class User implements UserData {
  api: API;
  url: string;
  audience: string;
  token!: Token;
  _fromStorage?: boolean;

  app_metadata!: UserData['app_metadata'];
  aud!: string;
  confirmed_at!: string;
  created_at!: string;
  email!: string;
  id!: string;
  role!: string;
  updated_at!: string;
  user_metadata!: UserData['user_metadata'];

  constructor(api: API, tokenResponse: Token, audience = '') {
    this.api = api;
    this.url = api.apiURL;
    this.audience = audience;
    this._processTokenResponse(tokenResponse);
  }

  get admin() {
    return new Admin(this);
  }

  update(attributes: UserRequest) {
    return this._request('/user', {
      method: 'PUT',
      body: JSON.stringify(attributes),
    }).then((response) => this._saveUserData(response));
  }

  jwt(forceRefresh?: boolean) {
    const token = this.tokenDetails();
    if (token == undefined) {
      return Promise.reject(
        new Error(`Gotrue-js: failed getting jwt access token`),
      );
    }
    const { expires_at, refresh_token, access_token } = token;
    if (forceRefresh || expires_at - ExpiryMargin < Date.now()) {
      return this._refreshToken(refresh_token);
    }
    return Promise.resolve(access_token);
  }

  logout() {
    return this._request('/logout', { method: 'POST' });
  }

  _refreshToken(refresh_token: string) {
    if (refreshPromises[refresh_token] != undefined) {
      return refreshPromises[refresh_token];
    }

    return (refreshPromises[refresh_token] = this.api
      .request('/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
      })
      .then((response) => {
        delete refreshPromises[refresh_token];
        this._processTokenResponse(response);
        return this.token.access_token;
      })
      .catch((error) => {
        delete refreshPromises[refresh_token];
        throw error;
      }));
  }

  _request<P extends keyof RequestMap>(
    path: `/admin/users/${unknown & string}`,
    options?: RequestOptions,
  ): Promise<RequestMap['/admin/users/:id']>;
  _request<P extends keyof RequestMap>(
    path: P,
    options?: RequestOptions,
  ): Promise<RequestMap[P]>;
  async _request<P extends keyof RequestMap>(
    path: P,
    options: RequestOptions = {},
  ) {
    options.headers = options.headers || {};

    const aud = options.audience || this.audience;
    if (aud) {
      options.headers['X-JWT-AUD'] = aud;
    }

    try {
      const token = await this.jwt();
      return await this.api.request<P>(path, {
        headers: Object.assign(options.headers, {
          Authorization: `Bearer ${token}`,
        }),
        ...options,
      });
    } catch (error: unknown) {
      throw formatError(error);
    }
  }

  getUserData() {
    return this._request('/user').then(this._saveUserData.bind(this));
  }

  _saveUserData(attributes: UserData, fromStorage?: boolean) {
    for (const key in attributes) {
      if (key in User.prototype || key in forbiddenUpdateAttributes) {
        continue;
      }
      this[key as keyof UserData] = attributes[key as keyof UserData] as any;
    }
    if (fromStorage) {
      this._fromStorage = true;
    }
    return this;
  }

  _processTokenResponse(tokenResponse: Token) {
    this.token = tokenResponse;
    try {
      const claims = JSON.parse(
        urlBase64Decode(tokenResponse.access_token.split('.')[1]),
      ) as { exp: number };
      this.token.expires_at = claims.exp * 1000;
    } catch (error: unknown) {
      console.error(
        new Error(
          `Gotrue-js: Failed to parse tokenResponse claims: ${error as string}`,
        ),
      );
    }
  }

  tokenDetails() {
    return this.token;
  }
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

  // polifyll https://github.com/davidchambers/Base64.js
  const result = atob(output);
  try {
    return decodeURIComponent(escape(result));
  } catch (error: unknown) {
    return result;
  }
}
