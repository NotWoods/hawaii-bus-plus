import type { ColorString, Shape, Stop } from '@hawaii-bus-plus/types';
import { last } from '@hawaii-bus-plus/utils';
import type { ComponentChildren } from 'preact';
import { memo } from 'preact/compat';
import type { RouteDetails } from '@hawaii-bus-plus/workers/info';
import type {
  Journey,
  JourneyTripSegment,
} from '@hawaii-bus-plus/workers/directions';
import { isJourneyTripSegment } from '../sheet/directions/JourneySegment';
import { useSelector } from '../router/hooks';
import { selectJourney, selectLoadedDetails } from '../router/selector/main';
import { AllMarkers } from './markers/AllMarkers';
import { ShapeLine } from './ShapeLine';

interface Props {
  darkMode: boolean;
  journey?: Journey;
  routeDetails?: RouteDetails;
  directionId: 0 | 1;
}

const RouteGlyphsContent = memo(
  ({ darkMode, journey, routeDetails, directionId }: Props) => {
    let highlightedStops: ReadonlyMap<Stop['stop_id'], ColorString> | undefined;
    let stopsInTrip: ReadonlySet<Stop['stop_id']> | undefined;
    let shapes: ComponentChildren = null;
    if (journey) {
      highlightedStops = journey.stops;
      const unique = new Map<Shape['shape_id'] | undefined, JourneyTripSegment>(
        journey.trips
          .filter(isJourneyTripSegment)
          .map((segment) => [segment.trip.shape_id, segment] as const),
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
    } else if (routeDetails) {
      const currentTrip = routeDetails.directions[directionId]?.closestTrip;
      const shapeId = currentTrip?.trip?.shape_id;

      highlightedStops = routeDetails.stops;
      stopsInTrip =
        currentTrip &&
        new Set(currentTrip.stopTimes.map((st) => st.stop.stop_id));
      shapes = [
        <ShapeLine
          key={shapeId}
          shapeId={shapeId}
          routeColor={routeDetails.route.route_color}
        />,
      ];
    }

    return (
      <>
        <AllMarkers
          highlighted={highlightedStops}
          focused={stopsInTrip}
          darkMode={darkMode}
        />
        {shapes}
      </>
    );
  },
);

export function RouteGlyphs(props: Pick<Props, 'darkMode'>) {
  const journey = useSelector(selectJourney);
  const { routeDetails, directionId } = useSelector(selectLoadedDetails);

  return (
    <RouteGlyphsContent
      darkMode={props.darkMode}
      journey={journey}
      routeDetails={routeDetails}
      directionId={directionId}
    />
  );
}
