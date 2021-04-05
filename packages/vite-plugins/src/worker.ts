import { createHash } from 'crypto';
import path from 'path';
import { rollup } from 'rollup';
import { URL, URLSearchParams } from 'url';
import { Plugin, ResolvedConfig } from 'vite';

const queryRE = /\?.*$/;
const hashRE = /#.*$/;
export const cleanUrl = (url: string) =>
  url.replace(hashRE, '').replace(queryRE, '');

export function getAssetHash(content: Buffer) {
  return createHash('sha256').update(content).digest('hex').slice(0, 8);
}

const ENV_PUBLIC_PATH = `/@vite/env`;

function parseWorkerRequest(id: string): URLSearchParams {
  return new URL(id, 'relative:///').searchParams;
}

const WorkerFileId = 'worker_file';

export function webWorkerCodeSplit(workerQuery = 'worker'): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'worker_code_split',

    apply: 'build',

    load(id) {
      if (parseWorkerRequest(id).has(workerQuery)) {
        return '';
      } else {
        return undefined;
      }
    },

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    async transform(_, id) {
      const query = parseWorkerRequest(id);
      if (query.has(WorkerFileId)) {
        return {
          code: `import '${ENV_PUBLIC_PATH}'\n${_}`,
        };
      }
      if (!query.has(workerQuery)) {
        return;
      }

      let url: string;
      {
        const bundle = await rollup({
          input: cleanUrl(id),
          plugins: config.plugins as Plugin[],
        });

        let code: string;
        try {
          const { output } = await bundle.generate({
            format: 'es',
            sourcemap: config.build.sourcemap,
          });
          code = output[0].code;
        } finally {
          void bundle.close();
        }
        const content = Buffer.from(code);

        {
          // emit as separate chunk
          url = `__VITE_ASSET__${this.emitFile({
            type: 'chunk',
            id: cleanUrl(id),
          })}__`;

          // Build both script and module versions
          const basename = path.basename(cleanUrl(id));
          const ext = path.extname(basename);
          const contentHash = getAssetHash(content);
          const fileName = path.posix.join(
            config.build.assetsDir,
            `${basename.slice(0, -ext.length)}.${contentHash}.js`,
          );
          const legacyUrl = `__VITE_ASSET__${this.emitFile({
            fileName,
            type: 'asset',
            source: code,
          })}__`;

          return `export default function WorkerWrapper() {
            let supportsModuleWorker = false
            const options = {
              get type() {
                supportsModuleWorker = true
                return 'module'
              }
            }
            const modWorker = new Worker(${JSON.stringify(url)}, options)
            if (supportsModuleWorker) {
              return modWorker
            } else {
              return new Worker(${JSON.stringify(legacyUrl)})
            }
          }`;
        }
      }
    },
  };
}
