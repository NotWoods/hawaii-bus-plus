import { formatDuration } from '@hawaii-bus-plus/presentation';
import React, { useState } from 'react';
import type { RouteDetails } from '../../../worker-info/route-details';
import type { DirectionDetails } from '../../../worker-info/trip-details';
import { Icon } from '../../icons/Icon';
import swapIcon from '../../icons/swap_horiz.svg';
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
  const dirDetails = props.details.directions[selectedId];
  const trip = dirDetails.closestTrip.trip;

  return (
    <>
      <div>
        <h3 className="content-title m-0">{trip.trip_short_name}</h3>
        <p className="mt-0">
          <span>{trip.stop_times.length} stops</span>
          {' | '}
          <TripOffset
            stopName={dirDetails.closestTrip.stopName}
            offset={dirDetails.closestTrip.offset}
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
        stopTimes={dirDetails.closestTrip.stopTimes}
        timeZone={props.details.timeZone}
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
