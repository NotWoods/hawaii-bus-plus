import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createApiData } from './bus/parse.js';

function writeJson(path: string, json: unknown) {
  const str = JSON.stringify(json);
  return writeFile(path, str, { encoding: 'utf8' });
}

/**
 * Generate an API file from the given GTFS zip path.
 */
export async function generateApi(
  gtfsZipFile: Promise<Buffer | ArrayBuffer | Uint8Array>,
  apiFolder: string,
): Promise<void> {
  const folderReady = mkdir(apiFolder, { recursive: true });
  const [api, shapes] = await createApiData(await gtfsZipFile);

  await folderReady;
  const jobs: Promise<unknown>[] = [
    writeJson(join(apiFolder, 'api.json'), api),
  ];
  const shapeFolder = join(apiFolder, 'shapes');
  const bikeFolder = join(apiFolder, 'bike');
  await Promise.all([
    mkdir(shapeFolder, { recursive: true }),
    mkdir(bikeFolder, { recursive: true }),
  ]);

  for (const shape of shapes.values()) {
    jobs.push(writeJson(join(shapeFolder, `${shape.shape_id}.json`), shape));
  }

  await Promise.all(jobs);
}
