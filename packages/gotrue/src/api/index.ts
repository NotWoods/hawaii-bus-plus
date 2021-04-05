import fetch, { Response, RequestInit } from 'node-fetch';
import { RequestMap } from './interface.js';
import { getPagination } from './pagination.js';

type ResponseData = Pick<Response, 'status' | 'statusText'>;

export class HTTPError extends Error {
  status: number;

  constructor(status: number, statusText: string);
  constructor(response: ResponseData);
  constructor(response: ResponseData | number, statusText?: string) {
    if (typeof response === 'number') {
      response = { status: response, statusText: statusText! };
    }

    super(response.statusText);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(response.statusText).stack;
    }
    this.status = response.status;
  }
}

export class TextHTTPError extends HTTPError {
  data: unknown;

  constructor(response: ResponseData, data: unknown) {
    super(response);
    this.data = data;
  }
}

export class JSONHTTPError extends HTTPError {
  json: unknown;

  constructor(response: ResponseData, json: unknown) {
    super(response);
    this.json = json;
  }
}

interface APIOptions {
  defaultHeaders?: Record<string, string>;
}

export default class API {
  apiURL: string;
  private readonly _sameOrigin?: boolean;
  defaultHeaders: Record<string, string>;

  constructor(apiURL = '', options?: APIOptions) {
    this.apiURL = apiURL;
    if (this.apiURL.match(/\/[^\/]?/)) {
      // eslint-disable-line no-useless-escape
      this._sameOrigin = true;
    }
    this.defaultHeaders = (options && options.defaultHeaders) || {};
  }

  headers(headers = {}) {
    return {
      ...this.defaultHeaders,
      'Content-Type': 'application/json',
      ...headers,
    };
  }

  parseJsonResponse(response: Response): any {
    return response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(new JSONHTTPError(response, json));
      }

      const pagination = getPagination(response);
      return pagination ? { pagination, items: json } : json;
    });
  }

  request<P extends keyof RequestMap>(
    path: P,
    options: RequestInit = {},
  ): Promise<RequestMap[P]> {
    const headers = this.headers(options.headers || {});
    if (this._sameOrigin) {
      // options.credentials = options.credentials || 'same-origin';
    }
    return fetch(this.apiURL + path, { ...options, headers }).then(
      (response) => {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.match(/json/)) {
          return this.parseJsonResponse(response) as RequestMap[P];
        }

        if (!response.ok) {
          return response.text().then((data) => {
            return Promise.reject(new TextHTTPError(response, data));
          });
        }
        return response.text().then((data) => data as RequestMap[P]);
      },
    );
  }
}
