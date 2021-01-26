import { readFile, writeFile, mkdir } from 'fs/promises';
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
  const [api, shapes] = await createApiData(zipData);

  const jobs: Promise<unknown>[] = [
    writeJson(join(apiFolder, 'api.json'), api),
  ];
  const shapeFolder = join(apiFolder, 'shapes');
  try {
    await mkdir(shapeFolder);
  } catch (err) {
    if (err.code === 'EEXIST') {
      // Folder already exists
    } else {
      throw err;
    }
  }
  for (const shape of shapes.values()) {
    jobs.push(writeJson(join(shapeFolder, `${shape.shape_id}.json`), shape));
  }

  await Promise.all(jobs);
}
