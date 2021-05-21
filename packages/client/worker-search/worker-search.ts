import { BaseMessageRequest, registerWorker } from '../worker-shared/register';
import { SearchRequest } from './helpers';
import { search, SearchResults } from './search-db';

export type { SearchResults };

interface SearchMessage extends BaseMessageRequest, SearchRequest {
  type: 'search';
}

export interface SearchWorkerHandler {
  (signal: AbortSignal, message: SearchMessage): Promise<SearchResults>;
}

registerWorker((repo, message: SearchMessage) => search(repo, message));
