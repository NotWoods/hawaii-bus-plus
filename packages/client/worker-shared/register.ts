import { makeRepository, Repository } from '@hawaii-bus-plus/data';
import { registerPromiseWorker } from '@hawaii-bus-plus/promise-worker/worker';

export interface BaseMessageRequest {
  type: string;
  apiKey: string;
}

let repo: Repository;
export function registerWorker<T extends BaseMessageRequest>(
  onMessage: (repo: Repository, message: T) => Promise<unknown>
) {
  registerPromiseWorker((message: T) => {
    repo = makeRepository(message.apiKey);
    return onMessage(repo, message);
  });
}
