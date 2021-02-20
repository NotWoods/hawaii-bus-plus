export function registerPromiseWorker(
  callback: (message: any) => Promise<unknown> | unknown
) {
  function postOutgoingMessage(
    messageId: number,
    error: Error | undefined,
    result?: unknown
  ) {
    if (error) {
      self.postMessage([messageId, error]);
    } else {
      self.postMessage([messageId, undefined, result]);
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
      (result) => postOutgoingMessage(messageId, undefined, result),
      (error) => postOutgoingMessage(messageId, error)
    );
  };
}
