import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { generateApi } from './api.js';

const { values } = parseArgs({
  options: {
    // Path to the GTFS zip file
    input: { type: 'string' },
    // Path to the folder to write the API files to
    output: { type: 'string' },
  },
});

function downloadInput(path: string) {
  if (/https?:\/\//.test(path)) {
    return fetch(path).then((response) => response.arrayBuffer());
  } else {
    return readFile(resolve(path));
  }
}

const { input: gtfsZipPath, output: apiFolder } = values;
if (!gtfsZipPath || !apiFolder) {
  throw new TypeError(`missing input or output arguments`);
}

try {
  await generateApi(downloadInput(gtfsZipPath), resolve(apiFolder));
  console.log('Wrote API files');
} catch (err) {
  console.error(err);
  process.exit(1);
}
