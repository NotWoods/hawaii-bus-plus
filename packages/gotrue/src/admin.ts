import { User, UserData } from './user.js';

export class Admin {
  user: User;

  constructor(user: User) {
    this.user = user;
  }

  // Return a list of all users in an audience
  listUsers(aud: string) {
    return this.user._request('/admin/users', {
      method: 'GET',
      audience: aud,
    });
  }

  getUser(user: { id: string }) {
    return this.user._request(`/admin/users/${user.id}` as const);
  }

  updateUser(user: { id: string }, attributes: Partial<UserData> = {}) {
    return this.user._request(`/admin/users/${user.id}` as const, {
      method: 'PUT',
      body: JSON.stringify(attributes),
    });
  }

  createUser(
    email: string,
    password: string,
    attributes: Partial<UserData> = {}
  ) {
    attributes.email = email;
    (attributes as UserData & { password: string }).password = password;
    return this.user._request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(attributes),
    });
  }

  deleteUser(user: { id: string }) {
    return this.user._request(`/admin/users/${user.id}` as const, {
      method: 'DELETE',
    });
  }
}
