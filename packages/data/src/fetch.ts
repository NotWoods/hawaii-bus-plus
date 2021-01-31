import { GTFSData } from '@hawaii-bus-plus/types';

export async function downloadScheduleData(
  signal?: AbortSignal
): Promise<GTFSData> {
  const apiKey = localStorage.getItem('api-key');
  const res = await fetch('/api/v1/api.json', {
    signal,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (!res.ok) {
    if (res.status === 401) {
      // Unauthorized, delete bad API key
      localStorage.removeItem('api-key');
    }
    throw new Error(res.statusText);
  }
  const json = await res.json();
  return json as GTFSData;
}
