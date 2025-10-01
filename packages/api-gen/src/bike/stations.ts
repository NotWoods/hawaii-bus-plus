import type {
  GbfsWrapper,
  JsonFeed,
  JsonStationInformation,
  StationInformation,
} from '@hawaii-bus-plus/types';
import { GBFS_URL } from '../env.ts';

async function getFeeds() {
  const res = await fetch(GBFS_URL.href);
  const json = await res.json();
  const feeds = json as GbfsWrapper<{ [lang: string]: { feeds: JsonFeed[] } }>;

  return new Map(feeds.data['en'].feeds.map((feed) => [feed.name, feed.url]));
}

function formatInfo(station: JsonStationInformation): StationInformation {
  return {
    station_id: station.station_id,
    name: station.name,
    address: station.address,
    capacity: station.capacity,
    region_id: station.groups?.[0],
    position: {
      lat: station.lat,
      lng: station.lon,
    },
  };
}

export async function cacheStations() {
  const feeds = await getFeeds();
  const response = await fetch(feeds.get('station_information')!);
  const json = await response.json();
  const {
    data: { stations },
  } = json as GbfsWrapper<{ stations: JsonStationInformation[] }>;

  return Object.fromEntries(
    stations.map((station) => [station.station_id, formatInfo(station)]),
  );
}
