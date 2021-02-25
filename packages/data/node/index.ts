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
    let apiLocation = path;
    if (!apiLocation) {
      const rel = '../../client/public/api/v1/api.json';
      if (import.meta.url) {
        apiLocation = new URL(rel, import.meta.url);
      } else {
        apiLocation = resolve(__dirname, rel);
      }
    }
    this.apiReady = this.init(apiLocation);
  }

  private async init(apiLocation: string | URL): Promise<GTFSData> {
    const data = await readFile(apiLocation, 'utf8');
    return JSON.parse(data) as GTFSData;
  }
}
