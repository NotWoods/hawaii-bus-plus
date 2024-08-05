import { BaseMemoryRepository } from '@hawaii-bus-plus/data';
import type { GTFSData } from '@hawaii-bus-plus/types';
import api from '../public/api/v1/api.json';

export class AstroJsonRepository extends BaseMemoryRepository {
  protected override readonly apiReady = Promise.resolve(
    api as unknown as GTFSData,
  );
}
