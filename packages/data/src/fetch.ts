import { GTFSData } from '@hawaii-bus-plus/types';

export function downloadScheduleData(signal?: AbortSignal): Promise<GTFSData> {
  return fetch('/api.json', { signal })
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error(res.statusText);
    })
    .then((json) => json as GTFSData);
}
