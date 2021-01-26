import { formatDuration } from '@hawaii-bus-plus/presentation';
import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import React, { useEffect, useState } from 'react';
import type { RouteDetails } from '../../../worker-info/route-details';
import type { DirectionDetails } from '../../../worker-info/trip-details';
import { Icon } from '../../icons/Icon';
import swapIcon from '../../icons/swap_horiz.svg';
import { ShapeLine } from '../../map/ShapeLine';
import { StopTimesList } from './StopTimesList';

interface Props {
  details: RouteDetails;
}

function validIndexes(directions: readonly unknown[]) {
  const result: number[] = [];
  directions.forEach((_, i) => result.push(i));
  return result;
}

export function TripDetails(props: Props) {
  const directionIds = validIndexes(props.details.directions);
  const [selectedIdIndex, setSelectedIdIndex] = useState(directionIds[0]);
  const selectedId = directionIds[selectedIdIndex % directionIds.length];
  const { closestTrip } = props.details.directions[selectedId];

  const map = useGoogleMap();
  useEffect(() => {
    map?.fitBounds(props.details.bounds);
  }, [map, props.details.bounds]);

  return (
    <>
      <ShapeLine
        shapeId={closestTrip.trip.shape_id}
        routeColor={props.details.route.route_color}
      />
      <div>
        <h3 className="content-title m-0">
          {closestTrip.trip.trip_short_name}
        </h3>
        <p className="mt-0">
          <span>{closestTrip.stopTimes.length} stops</span>
          {' | '}
          <TripOffset
            stopName={closestTrip.stopName}
            offset={closestTrip.offset}
          />
        </p>
        {directionIds.length > 1 ? (
          <a
            className="btn btn-sm"
            onClick={() => setSelectedIdIndex(selectedIdIndex + 1)}
          >
            <Icon src={swapIcon} alt="" /> Switch direction
          </a>
        ) : null}
      </div>
      <hr className="mt-10" />
      <StopTimesList
        routeId={props.details.route.route_id}
        stopTimes={closestTrip.stopTimes}
        timeZone={props.details.agency.agency_timezone}
      />
    </>
  );
}

export function TripOffset(
  props: Pick<DirectionDetails['closestTrip'], 'offset' | 'stopName'>
) {
  const duration = formatDuration(props.offset);

  if (duration) {
    return (
      <span>
        Reaches {props.stopName} {duration}
      </span>
    );
  } else {
    return <span>Reaches {props.stopName} now</span>;
  }
}
