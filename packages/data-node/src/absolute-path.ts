import { resolve } from 'node:path';
import { URL } from 'node:url';

export function absolutePath(relative: string | URL): string | URL {
  if (import.meta.url) {
    return new URL(relative.toString(), import.meta.url);
  } else {
    return resolve(__dirname, relative as string);
  }
}
