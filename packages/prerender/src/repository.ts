import { BaseMemoryRepository } from '@hawaii-bus-plus/data';
import type { GTFSData } from '@hawaii-bus-plus/types';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { URL } from 'node:url';

function absolutePath(relative: string): string | URL {
  if (import.meta.url) {
    return new URL(relative, import.meta.url);
  } else {
    return resolve(__dirname, relative);
  }
}

export class NodeJsonRepository extends BaseMemoryRepository {
  /**
   * @override
   */
  protected readonly apiReady: Promise<GTFSData>;

  constructor() {
    super();
    const paths: string[] = [
      '../../client/public/api/v1/api.json',
      '../../../dist/functions/api/api.json',
    ];

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
