import { Opaque } from 'type-fest';

export type TimeString = Opaque<string, '00:00:00'>;

export type DateString = Opaque<string, '0000-00-00'>;

export type ColorString = Opaque<string, '#ffffff'>;
