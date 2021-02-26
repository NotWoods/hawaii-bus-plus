import { ColorString, Shape, Stop } from '@hawaii-bus-plus/types';
import { last } from '@hawaii-bus-plus/utils';
import { ComponentChildren, h, Fragment } from 'preact';
import { useContext } from 'preact/hooks';
import { isJourneyTripSegment } from '../directions/JourneySegment';
import { RouterContext } from '../router/Router';
import { RouteDetailContext } from '../routes/timetable/context';
import { ShapeLine } from './ShapeLine';
import { StopStationMarkers } from './markers/StopStationMarkers';
import { DIRECTIONS_PATH, RouterState } from '../router/state';
import { JourneyTripSegment } from '../../worker-nearby/directions/format';

interface Props {
  darkMode?: boolean;
}

function getJourney({ main }: Pick<RouterState, 'main'>) {
  if (main?.path === DIRECTIONS_PATH) {
    return main.journey;
  } else {
    return undefined;
  }
}

export function RouteGlyphs({ darkMode }: Props) {
  const journey = getJourney(useContext(RouterContext));
  const { details, directionId } = useContext(RouteDetailContext);

  let highlightedStops: ReadonlyMap<Stop['stop_id'], ColorString> | undefined;
  let stopsInTrip: ReadonlySet<Stop['stop_id']> | undefined;
  let shapes: ComponentChildren = null;
  if (journey) {
    highlightedStops = journey.stops;
    const unique = new Map<Shape['shape_id'] | undefined, JourneyTripSegment>(
      journey.trips
        .filter(isJourneyTripSegment)
        .map((segment) => [segment.trip.shape_id, segment] as const)
    );

    shapes = Array.from(unique.values()).map((segment) => {
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
