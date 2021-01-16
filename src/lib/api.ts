import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { createApiData } from './parse.js';

function writeJson(path: string, json: unknown) {
  const str = JSON.stringify(json);
  return writeFile(path, str, { encoding: 'utf8' });
}

/**
 * Generate an API file from the given GTFS zip path.
 * @param gtfsZipPath
 */
export async function generateApi(
  gtfsZipPath: string,
  apiFolder: string
): Promise<void> {
  const zipData = await readFile(gtfsZipPath, { encoding: null });
  const api = await createApiData(zipData);

  await Promise.all([writeJson(join(apiFolder, 'api.json'), api)]);
}
