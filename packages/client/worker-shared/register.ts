import { makeRepository, Repository } from '@hawaii-bus-plus/data';
import { registerPromiseWorker } from '@hawaii-bus-plus/promise-worker/worker';

export interface BaseMessageRequest {
  type: string;
}

let repo: Repository;
export function registerWorker<T>(
  onMessage: (repo: Repository, message: T) => Promise<unknown>,
) {
  repo = makeRepository();
  registerPromiseWorker((message: T) => {
    return onMessage(repo, message);
  });
}
