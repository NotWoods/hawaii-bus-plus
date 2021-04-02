import { GTFSData } from '@hawaii-bus-plus/types';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { URL } from 'url';
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
      '../../../dist/functions/api.json',
    ];
    if (path) {
      paths.unshift(path);
    }

    const apiLocations = paths.map((relative) => {
      if (import.meta.url) {
        return new URL(
          relative instanceof URL ? relative.href : relative,
          import.meta.url
        );
      } else {
        return resolve(__dirname, relative as string);
      }
    });
    this.apiReady = this.init(apiLocations);
  }

  private async init(
    apiLocations: readonly (string | URL)[]
  ): Promise<GTFSData> {
    let data: string | undefined;
    const errors: unknown[] = [];
    for (const apiLocation of apiLocations) {
      try {
        data = await readFile(apiLocation, 'utf8');
      } catch (err: unknown) {
        errors.push(err);
      }

      if (data) break;
    }

    if (!data) {
      console.error(errors);
      throw new Error(errors as any);
      // throw new AggregateError(errors);
    }

    return JSON.parse(data) as GTFSData;
  }
}
