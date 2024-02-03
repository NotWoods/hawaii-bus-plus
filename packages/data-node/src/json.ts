import { BaseMemoryRepository } from '@hawaii-bus-plus/data';
import { GTFSData } from '@hawaii-bus-plus/types';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
import { absolutePath } from './absolute-path.js';

export class NodeJsonRepository extends BaseMemoryRepository {
  /**
   * @override
   */
  protected readonly apiReady: Promise<GTFSData>;

  constructor(jsonPath?: string | URL) {
    super();
    const paths: (string | URL)[] = [
      '../../client/public/api/v1/api.json',
      '../../../dist/functions/api/api.json',
    ];
    if (jsonPath) {
      paths.unshift(jsonPath);
    }

    const apiLocations = paths.map(absolutePath);
    this.apiReady = this.init(apiLocations);
  }

  private async init(
    apiLocations: readonly (string | URL)[],
  ): Promise<GTFSData> {
    const data = await Promise.any(
      apiLocations.map((apiLocation) => readFile(apiLocation, 'utf8')),
    );

    return JSON.parse(data) as GTFSData;
  }
}
