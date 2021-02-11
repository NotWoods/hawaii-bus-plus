let messageIds = 0;

export class AbortError extends Error {
  code = 'abort';

  constructor() {
    super('Aborted');
  }
}

export class PromiseWorker {
  private readonly callbacks = new Map<
    number,
    (error: Error | undefined, result: unknown) => void
  >();

  constructor(private readonly worker: Worker) {
    worker.addEventListener('message', (evt) => this.onMessage(evt.data));
    worker.addEventListener('error', (evt) => {
      console.error('Worker error', evt);
    });
  }

  private onMessage(message: unknown) {
    if (!Array.isArray(message) || message.length < 2) {
      // Ignore - this message is not for us.
      return;
    }

    const [messageId, error, result] = message;
    const callback = this.callbacks.get(messageId);

    if (!callback) {
      // Ignore - user might have created multiple PromiseWorkers.
      // This message is not for us.
      return;
    }

    this.callbacks.delete(messageId);

    callback(error, result);
  }

  postMessage(userMessage: unknown, signal?: AbortSignal): Promise<unknown> {
    const messageId = messageIds++;
    const messageToSend = [messageId, userMessage];

    return new Promise((resolve, reject) => {
      const onAbort = () => {
        this.callbacks.delete(messageId);
        reject(new AbortError());
      };

      if (signal?.aborted) {
        onAbort();
      }

      this.callbacks.set(messageId, (error, result) => {
        signal?.removeEventListener('abort', onAbort);
        if (error) reject(error);
        else resolve(result);
      });

      signal?.addEventListener('abort', onAbort, { once: true });

      this.worker.postMessage(messageToSend);
    });
  }

  terminate() {
    return this.worker.terminate();
  }
}
