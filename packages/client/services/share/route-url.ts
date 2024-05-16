import type { Route, Trip } from '@hawaii-bus-plus/types';

export function routeShareUrl(
  routeId: Route['route_id'],
  tripId?: Trip['trip_id'],
) {
  let shareHref = `https://app.hawaiibusplus.com/share/routes/${routeId}`;
  if (tripId) {
    shareHref += `#${tripId}`;
  }
  return shareHref;
}
