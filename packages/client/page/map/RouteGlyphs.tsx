import { ColorString, Stop } from '@hawaii-bus-plus/types';
import { last } from '@hawaii-bus-plus/utils';
import { ComponentChildren, h, Fragment } from 'preact';
import { useContext } from 'preact/hooks';
import { isJourneyTripSegment } from '../directions/JourneySegment';
import { RouterContext } from '../router/Router';
import { RouteDetailContext } from '../routes/timetable/context';
import { ShapeLine } from './ShapeLine';
import { StopStationMarkers } from './markers/StopStationMarkers';

interface Props {
  darkMode?: boolean;
}

export function RouteGlyphs({ darkMode }: Props) {
  const { directions } = useContext(RouterContext);
  const { details, directionId } = useContext(RouteDetailContext);

  let highlightedStops: ReadonlyMap<Stop['stop_id'], ColorString> | undefined;
  let stopsInTrip: ReadonlySet<Stop['stop_id']> | undefined;
  let shapes: ComponentChildren = null;
  if (directions) {
    if (directions.journey) {
      highlightedStops = directions.journey.stops;
      shapes = directions.journey.trips
        .filter(isJourneyTripSegment)
        .map((segment) => {
          const shapeId = segment.trip.shape_id;
          const start = segment.stopTimes[0].shapeDistTraveled;
          const end = last(segment.stopTimes).shapeDistTraveled;
          const edges =
            start != undefined && end != undefined
              ? ([start, end] as const)
              : undefined;
          return (
            <ShapeLine
              key={shapeId}
              edges={edges}
              shapeId={shapeId}
              routeColor={segment.route.route_color}
            />
          );
        });
    }
  } else if (details) {
    const currentTrip = details.directions[directionId]?.closestTrip;
    const shapeId = currentTrip?.trip?.shape_id;

    highlightedStops = details.stops;
    stopsInTrip =
      currentTrip &&
      new Set(currentTrip.stopTimes.map((st) => st.stop.stop_id));
    shapes = [
      <ShapeLine
        key={shapeId}
        shapeId={shapeId}
        routeColor={details.route.route_color}
      />,
    ];
  }

  return (
    <>
      <StopStationMarkers
        highlighted={highlightedStops}
        focused={stopsInTrip}
        darkMode={darkMode}
      />
      {shapes}
    </>
  );
}
