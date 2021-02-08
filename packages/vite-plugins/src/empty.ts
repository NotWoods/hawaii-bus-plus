import type { Plugin } from 'vite';

export function emptyPackage(name: string): Plugin {
  return {
    name: 'empty',
    load(id) {
      if (id === name) {
        return 'export {}';
      }
      return undefined;
    },
  };
}
