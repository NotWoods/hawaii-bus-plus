import { GTFSData } from '@hawaii-bus-plus/types';

export class UnauthorizedError extends Error {
  code = 401;
}

export async function downloadScheduleData(
  apiKey: string,
  signal?: AbortSignal
): Promise<GTFSData> {
  const res = await fetch('/api/v1/api.json', {
    signal,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new UnauthorizedError(res.statusText);
    } else {
      throw new Error(res.statusText);
    }
  }
  const json = await res.json();
  return json as GTFSData;
}
