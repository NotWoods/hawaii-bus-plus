import { PromiseWorker } from '@hawaii-bus-plus/promise-worker';
import { InitDBWorker } from '@hawaii-bus-plus/workers/init-db';

interface Fathom {
  trackPageview(opts?: { url?: string; referrer?: string }): void;
  trackGoal(code: string, cents: number): void;
}

declare global {
  let fathom: Fathom;
}

let dbInitialized: Promise<void>;
if (import.meta.env.SSR) {
  dbInitialized = Promise.resolve();
} else {
  const initWorker = new PromiseWorker(new InitDBWorker());
  dbInitialized = initWorker.postMessage().then(() => initWorker.terminate());
}

export { dbInitialized };
