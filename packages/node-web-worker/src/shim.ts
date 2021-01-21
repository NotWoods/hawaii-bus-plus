import { Worker as NodeWorker, TransferListItem } from 'worker_threads';
import { URL } from 'url';
import { EventTarget, Event } from 'event-target-shim';

export class ErrorEvent extends Event {
  readonly filename: string;
  readonly message: string;

  constructor(readonly error: Error) {
    super('error');
    this.filename = error.name;
    this.message = error.message;
  }
}

export class MessageEvent extends Event {
  constructor(readonly data: any) {
    super('message');
  }
}

export default class NodeWebWorker extends EventTarget {
  private workerThread: NodeWorker;

  constructor(stringUrl: string | URL, _options?: WorkerOptions) {
    super();
    const script = Buffer.from(`
      globalThis.self = {
        postMessage(msg) {}
      }

      import "${stringUrl}"
    `);
    const encoding = 'base64';
    const data = script.toString(encoding);
    const uri = `data:text/javascript;${encoding},${data}`;

    this.workerThread = new NodeWorker(uri);
    this.workerThread.on('error', (err) =>
      this.dispatchEvent(new ErrorEvent(err))
    );
    this.workerThread.on('message', (err) =>
      this.dispatchEvent(new MessageEvent(err))
    );
  }

  postMessage(
    message: any,
    transferList?: readonly TransferListItem[] | PostMessageOptions
  ) {
    if (transferList && !Array.isArray(transferList)) {
      transferList = transferList.transfer;
    }
    this.workerThread.postMessage(message, transferList);
  }

  terminate() {
    this.workerThread.terminate();
  }
}
