import type { Plugin } from 'vite';
import { URLSearchParams } from 'node:url';
import { basename } from 'node:path';

function parseWorkerRequest(id: string): [string, URLSearchParams] {
  const [path, query = ''] = id.split('?');
  return [path, new URLSearchParams(query)];
}

/**
 * Requires vite:worker and off-main-thread
 */
export function workerFallbackPlugin(flag = 'worker'): Plugin {
  return {
    name: 'worker_fallback',
    load(id) {
      const [path, parsedQuery] = parseWorkerRequest(id);
      if (parsedQuery.has(flag)) {
        return `
          import moduleUrl from 'omt:${path}'
          import BundledWorker from '${path}?worker'

          let supportsModuleWorker = false
          const options = {
            get type() {
              supportsModuleWorker = true
              return 'module'
            },
            name: ${JSON.stringify(basename(path))}
          }
          const modWorker = new Worker(moduleUrl, options)
          if (supportsModuleWorker) {
            return modWorker
          } catch (err) {
            return new BundledWorker()
          }
        `;
      }
      return undefined;
    },
  };
}
