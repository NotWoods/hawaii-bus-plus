import { BaseMessageRequest, registerWorker } from '../worker-shared/register';
import { loadMarkers, MarkersResponse } from './markers';

interface MapMarkersMessage extends BaseMessageRequest {
  type: 'markers';
}

type Message = MapMarkersMessage;

export interface MapWorkerHandler {
  (signal: AbortSignal, message: MapMarkersMessage): Promise<MarkersResponse>;
}

registerWorker((repo, message: Message) => {
  switch (message.type) {
    case 'markers':
      return loadMarkers(repo);
  }
});
