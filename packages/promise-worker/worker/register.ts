export function registerPromiseWorker(
  callback: (message: any) => Promise<unknown> | unknown
) {
  function postOutgoingMessage(
    messageId: number,
    error: Error | null,
    result?: unknown
  ) {
    if (error) {
      console.error('Worker caught an error:', error);
      self.postMessage([messageId, error]);
    } else {
      self.postMessage([messageId, null, result]);
    }
  }

  self.onmessage = function onIncomingMessage(evt: MessageEvent<unknown>) {
    const payload = evt.data;
    if (!Array.isArray(payload) || payload.length !== 2) {
      // message doesn't match communication format; ignore
      return;
    }

    const [messageId, message] = payload;

    Promise.resolve(callback(message)).then(
      (result) => postOutgoingMessage(messageId, null, result),
      (error) => postOutgoingMessage(messageId, error)
    );
  };
}
