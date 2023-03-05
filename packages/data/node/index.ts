import { GTFSData } from '@hawaii-bus-plus/types';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { URL } from 'node:url';
import { BaseMemoryRepository } from '../src/mem-repository/index.js';

export class NodeRepository extends BaseMemoryRepository {
  /**
   * @override
   */
  protected readonly apiReady;

  constructor(path?: string | URL) {
    super();
    const paths: (string | URL)[] = [
      '../../client/public/api/v1/api.json',
      '../../../dist/functions/api/api.json',
    ];
    if (path) {
      paths.unshift(path);
    }

    const apiLocations = paths.map((relative) => {
      if (import.meta.url) {
        return new URL(relative.toString(), import.meta.url);
      } else {
        return resolve(__dirname, relative as string);
      }
    });
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
