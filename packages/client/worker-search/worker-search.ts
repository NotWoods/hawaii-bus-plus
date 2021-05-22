import { registerWorker } from '../worker-shared/register';
import { SearchRequest } from './helpers';
import { search, SearchResults } from './search-db';

export type { SearchResults };

export interface SearchWorkerHandler {
  (signal: AbortSignal, message: SearchRequest): Promise<SearchResults>;
}

registerWorker((repo, message: SearchRequest) => search(repo, message));
