import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { createApiData } from './bus/parse.js';

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
  apiFolder: string,
): Promise<void> {
  const folderReady = mkdir(apiFolder, { recursive: true });
  const zipData = await readFile(gtfsZipPath);
  const [api, shapes] = await createApiData(zipData);

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
