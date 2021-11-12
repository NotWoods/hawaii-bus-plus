import { BaseMessageRequest, registerWorker } from '../shared/register';
import { loadMarkers, MarkersResponse } from './markers';

export type { MarkersResponse };

interface MapMarkersMessage extends BaseMessageRequest {
  type: 'markers';
}

type Message = MapMarkersMessage;

export interface MapWorkerHandler {
  (signal: AbortSignal, message: MapMarkersMessage): Promise<MarkersResponse>;
}

registerWorker((repo, message: Message) => {
  switch (message.type) {
    /* Load a list of marker locations to display on the map */
    case 'markers':
      return loadMarkers(repo);
  }
});
