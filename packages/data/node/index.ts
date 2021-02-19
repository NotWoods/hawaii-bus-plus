import { GTFSData } from '@hawaii-bus-plus/types';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { URL } from 'url';
import { BaseMemoryRepository } from '../src/mem-repository';

let apiLocation: string | URL = '../../client/public/api/v1/api.json';
if (import.meta.url) {
  apiLocation = new URL(apiLocation, import.meta.url);
} else {
  apiLocation = resolve(__dirname, apiLocation);
}

export class NodeRepository extends BaseMemoryRepository {
  /**
   * @override
   */
  protected readonly apiReady = this.init();

  private async init(): Promise<GTFSData> {
    const data = await readFile(apiLocation, 'utf8');
    return JSON.parse(data) as GTFSData;
  }
}
