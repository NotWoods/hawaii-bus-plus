import { registerWorker } from '../shared/register';
import type { SearchRequest } from './helpers';
import { search, type SearchResults } from './search-db';

export type { SearchResults, SearchRequest };

export interface SearchWorkerHandler {
  (signal: AbortSignal, message: SearchRequest): Promise<SearchResults>;
}

registerWorker((repo, message: SearchRequest) => search(repo, message));
