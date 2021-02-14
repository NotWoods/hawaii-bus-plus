import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { cacheStations } from './bike/stations.js';
import { createApiData } from './bus/parse.js';

function writeJson(path: string, json: unknown) {
  const str = JSON.stringify(json);
  return writeFile(path, str, { encoding: 'utf8' });
}

function fileAlreadyExists(err: unknown): err is Error {
  return (err as { code?: string }).code === 'EEXIST';
}

async function mkdirIfNotExists(folder: string) {
  try {
    await mkdir(folder);
  } catch (err: unknown) {
    if (fileAlreadyExists(err)) {
      // Folder already exists
    } else {
      throw err;
    }
  }
}

/**
 * Generate an API file from the given GTFS zip path.
 * @param gtfsZipPath
 */
export async function generateApi(
  gtfsZipPath: string,
  apiFolder: string
): Promise<void> {
  const bikeStationsReady = cacheStations();
  const zipData = await readFile(gtfsZipPath);
  const [api, shapes] = await createApiData(zipData);

  const jobs: Promise<unknown>[] = [
    writeJson(join(apiFolder, 'api.json'), api),
  ];
  const shapeFolder = join(apiFolder, 'shapes');
  const bikeFolder = join(apiFolder, 'bike');
  await Promise.all([
    mkdirIfNotExists(shapeFolder),
    mkdirIfNotExists(bikeFolder),
  ]);

  const bikeStations = await bikeStationsReady;
  jobs.push(
    writeJson(join(bikeFolder, 'station_information.json'), bikeStations)
  );

  for (const shape of shapes.values()) {
    jobs.push(writeJson(join(shapeFolder, `${shape.shape_id}.json`), shape));
  }

  await Promise.all(jobs);
}
