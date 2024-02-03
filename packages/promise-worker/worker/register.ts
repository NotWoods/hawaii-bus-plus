export function registerPromiseWorker(callback: (message: any) => unknown) {
  function postOutgoingMessage(
    messageId: number,
    error: Error | undefined,
    result?: unknown,
  ) {
    if (error) {
      globalThis.postMessage([
        messageId,
        {
          name: error.name,
          message: error.message,
          status: (error as { status?: unknown }).status,
          code: (error as { code?: unknown }).code,
        },
      ]);
    } else {
      globalThis.postMessage([messageId, undefined, result]);
    }
  }

  globalThis.onmessage = function onIncomingMessage(
    evt: MessageEvent<unknown>,
  ) {
    const payload = evt.data;
    if (!Array.isArray(payload) || payload.length !== 2) {
      // message doesn't match communication format; ignore
      return;
    }

    const [messageId, message] = payload as [number, unknown];

    Promise.resolve(callback(message)).then(
      (result) => postOutgoingMessage(messageId, undefined, result),
      (error: Error) => postOutgoingMessage(messageId, error),
    );
  };
}
