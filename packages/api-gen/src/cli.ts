import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { fetch } from 'undici';
import { generateApi } from './api.js';

const args = process.argv.slice(2);
if (args.length !== 2) {
  throw new TypeError(`should pass 2 arguments, not ${args.length}.`);
}

function downloadInput(path: string) {
  if (/https?:\/\//.test(path)) {
    return fetch(path).then((response) => response.arrayBuffer());
  } else {
    return readFile(resolve(path));
  }
}

const [gtfsZipPath, apiFolder] = args;

generateApi(downloadInput(gtfsZipPath), resolve(apiFolder))
  .then(() => {
    console.log('Wrote API files');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
