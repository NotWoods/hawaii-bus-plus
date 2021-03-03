import API from './api/index.js';
import { Provider, RequestMap, Token, UserData } from './api/interface.js';
import { formatError, RequestOptions, User } from './user.js';

const HTTPRegexp = /^http:\/\//;
const defaultApiURL = `/.netlify/identity`;

export { HTTPError, TextHTTPError, JSONHTTPError } from './api/index.js';
export * from './api/interface.js';
export * from './user.js';
export * from './admin.js';

export class GoTrue {
  audience?: string;
  api: API;

  constructor({ APIUrl = defaultApiURL, audience = '' } = {}) {
    if (HTTPRegexp.test(APIUrl)) {
      console.warn(
        'Warning:\n\nDO NOT USE HTTP IN PRODUCTION FOR GOTRUE EVER!\nGoTrue REQUIRES HTTPS to work securely.'
      );
    }

    if (audience) {
      this.audience = audience;
    }

    this.api = new API(APIUrl);
  }

  private async _request<P extends keyof RequestMap>(
    path: P,
    options: RequestOptions = {}
  ) {
    options.headers = options.headers || {};
    const aud = options.audience || this.audience;
    if (aud) {
      options.headers['X-JWT-AUD'] = aud;
    }
    try {
      return await this.api.request<P>(path, options);
    } catch (error: unknown) {
      throw formatError(error);
    }
  }

  settings() {
    return this._request('/settings');
  }

  signup(email: string, password: string, data?: UserData['user_metadata']) {
    return this._request('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, data }),
    });
  }

  login(email: string, password: string) {
    return this._request('/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=password&username=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`,
    }).then((response) => {
      return this.createUser(response);
    });
  }

  loginExternalUrl(provider: Provider) {
    return `${this.api.apiURL}/authorize?provider=${provider}`;
  }

  confirm(token: string) {
    return this.verify('signup', token);
  }

  requestPasswordRecovery(email: string) {
    return this._request('/recover', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  recover(token: string) {
    return this.verify('recovery', token);
  }

  acceptInvite(token: string, password: string) {
    return this.verify('signup', token, password);
  }

  acceptInviteExternalUrl(provider: string, token: string) {
    return `${this.api.apiURL}/authorize?provider=${provider}&invite_token=${token}`;
  }

  createUser(tokenResponse: Token) {
    const user = new User(this.api, tokenResponse, this.audience);
    return user.getUserData();
  }

  verify(type: 'signup' | 'recovery', token: string, password?: string) {
    return this._request('/verify', {
      method: 'POST',
      body: JSON.stringify(
        password ? { token, type, password } : { token, type }
      ),
    }).then((response) => this.createUser(response));
  }
}
