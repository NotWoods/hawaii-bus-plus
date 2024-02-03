import { createApiData } from '@hawaii-bus-plus/api-gen';
import { BaseMemoryRepository } from '@hawaii-bus-plus/data';
import { GTFSData } from '@hawaii-bus-plus/types';
import { memoize } from '@hawaii-bus-plus/utils';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
import { absolutePath } from './absolute-path.js';

const fixtures = {
  'big-island-buses': '../../api-gen/test/fixtures/big-island-buses.zip',
  'hele-on-2023-03': '../../api-gen/test/fixtures/hele-on.zip',
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
    const apiLocation = absolutePath(fixtures[fixture]);
    this.apiReady = cachedInit(apiLocation);
  }
}
