import { ColorString, Shape, Stop } from '@hawaii-bus-plus/types';
import { last } from '@hawaii-bus-plus/utils';
import { ComponentChildren, Fragment, h } from 'preact';
import { memo } from 'preact/compat';
import { useContext } from 'preact/hooks';
import type { RouteDetails } from '../../worker-info/route-details';
import type {
  Journey,
  JourneyTripSegment,
} from '../../worker-nearby/directions/format';
import { isJourneyTripSegment } from '../directions/JourneySegment';
import { useSelector } from '../router/hooks';
import { selectJourney } from '../router/selector/main';
import { RouteDetailContext } from '../routes/reducer/context';
import { StopStationMarkers } from './markers/StopStationMarkers';
import { ShapeLine } from './ShapeLine';

interface Props {
  darkMode?: boolean;
  journey?: Journey;
  details?: RouteDetails;
  directionId: 0 | 1;
}

const RouteGlyphsContent = memo(
  ({ darkMode, journey, details, directionId }: Props) => {
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
  },
);

export function RouteGlyphs(props: Pick<Props, 'darkMode'>) {
  const journey = useSelector(selectJourney);
  const { details, directionId } = useContext(RouteDetailContext);

  return (
    <RouteGlyphsContent
      darkMode={props.darkMode}
      journey={journey}
      details={details}
      directionId={directionId}
    />
  );
}
