// @ts-expect-error import user class
import UserClass from 'gotrue-js/lib/user';

export const User: typeof import('gotrue-js').User = UserClass;
export type Admin = import('gotrue-js').User['admin'];
