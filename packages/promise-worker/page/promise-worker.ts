let messageIds = 0;

export class PromiseWorker {
  private readonly callbacks = new Map<
    number,
    (error: Error | null, result: unknown) => void
  >();

  constructor(private readonly worker: Worker) {
    worker.addEventListener('message', (evt) => this.onMessage(evt.data));
    worker.addEventListener('error', (evt) =>
      console.error('Worker Error', evt, worker)
    );
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

  postMessage(userMessage: unknown) {
    const messageId = messageIds++;
    const messageToSend = [messageId, userMessage];

    return new Promise((resolve, reject) => {
      this.callbacks.set(messageId, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });

      this.worker.postMessage(messageToSend);
    });
  }

  terminate() {
    return this.worker.terminate();
  }
}
