import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { URL } from 'url';
import { MemoryRepository } from '../src/mem-repository';

let apiLocation: string | URL = '../../client/public/api/v1/api.json';
if (import.meta.url) {
  apiLocation = new URL(apiLocation, import.meta.url);
} else {
  apiLocation = resolve(__dirname, apiLocation);
}

export class NodeRepository extends MemoryRepository {
  async init() {
    const data = await readFile(apiLocation, 'utf8');
    return JSON.parse(data);
  }
}
