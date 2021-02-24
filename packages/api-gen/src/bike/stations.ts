import {
  GbfsWrapper,
  JsonFeed,
  JsonStationInformation,
  StationInformation,
} from '@hawaii-bus-plus/types';
import fetch from 'node-fetch';
import { GBFS_URL } from '../env.js';

async function getFeeds() {
  const res = await fetch(GBFS_URL.href);
  const json = await res.json();
  const feeds = json as GbfsWrapper<{ [lang: string]: { feeds: JsonFeed[] } }>;

  return new Map(
    feeds.data['en'].feeds.map((feed) => [feed.name, feed.url] as const)
  );
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
  const res = await fetch(feeds.get('station_information')!);
  const json = await res.json();
  const {
    data: { stations },
  } = json as GbfsWrapper<{ stations: JsonStationInformation[] }>;

  return Object.fromEntries(
    stations.map((station) => [station.station_id, formatInfo(station)])
  );
}
