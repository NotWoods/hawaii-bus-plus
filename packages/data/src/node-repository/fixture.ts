import { createApiData } from '@hawaii-bus-plus/api-gen';
import { BaseMemoryRepository } from '@hawaii-bus-plus/data';
import type { GTFSData } from '@hawaii-bus-plus/types';
import { memoize } from '@hawaii-bus-plus/utils';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';

const fixtures = {
  'big-island-buses': '../../../api-gen/test/fixtures/big-island-buses.zip',
  'hele-on-2023-03': '../../../api-gen/test/fixtures/hele-on.zip',
};

export type FixtureName = keyof typeof fixtures;
export const FixtureName = Object.keys(fixtures) as readonly FixtureName[];

async function init(apiLocation: string | URL): Promise<GTFSData> {
  const zipData = await readFile(apiLocation);
  const [api] = await createApiData(zipData);

  return JSON.parse(JSON.stringify(api)) as GTFSData;
}

const cachedInit = memoize(init);

export class NodeFixtureRepository extends BaseMemoryRepository {
  /**
   * @override
   */
  protected readonly apiReady;

  constructor(fixture: FixtureName = 'big-island-buses') {
    super();
    const apiLocation = new URL(fixtures[fixture], import.meta.url);
    this.apiReady = cachedInit(apiLocation);
  }
}
