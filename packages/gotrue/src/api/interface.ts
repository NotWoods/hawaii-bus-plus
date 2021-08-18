import { Page } from './index.js';

export interface RequestMap {
  '/settings': SettingsResponse;
  '/signup': SignupResponse;
  '/token': Token;
  // eslint-disable-next-line @typescript-eslint/ban-types
  '/recover': {};
  '/verify': Token;
  '/user': UserData;
  '/logout': '';
  '/admin/users': Page<UserData>;
  '/admin/users/:id': unknown;
}

export type Provider =
  | 'bitbucket'
  | 'github'
  | 'gitlab'
  | 'google'
  | 'facebook'
  | 'email'
  | 'saml';

export interface AppMetadata {
  provider?: Provider;
  roles?: readonly string[];
}

export interface UserMetadata {
  full_name?: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: 'bearer';
}

export interface SettingsResponse {
  external: Record<Provider, boolean>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  external_labels: {};
  disable_signup: boolean;
  autoconfirm: boolean;
}

export interface SignupResponse {
  app_metadata: AppMetadata;
  aud: string;
  confirmed_at: string;
  created_at: string;
  email: string;
  id: string;
  role: string;
  updated_at: string;
  user_metadata: UserMetadata | null;
}

export interface UserData extends SignupResponse {
  audience: string;
  token: Token;
  url: string;
  user_metadata: UserMetadata;
}

export interface UserRequest extends Partial<UserData> {
  password?: string;
}
