import { formatDuration } from '@hawaii-bus-plus/presentation';
import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
import { h, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';
import { Temporal } from 'proposal-temporal';
import type { RouteDetails } from '../../../worker-info/route-details';
import type { DirectionDetails } from '../../../worker-info/trip-details';
import { Icon } from '../../icons/Icon';
import swapIcon from '../../icons/swap_horiz.svg';
import { PlainDateTimeInput } from '../../sidebar/directions/DirectionsTime';
import { StopTimesList } from './StopTimesList';

interface Props {
  details: RouteDetails;
  directionId: number;
  tripTime: Temporal.PlainDateTime;
  switchDirection?(): void;
  onChangeTripTime(time: Temporal.PlainDateTime): void;
}

export function TripDetails(props: Props) {
  const directionDetails = props.details.directions[props.directionId];

  const map = useGoogleMap();
  useEffect(() => {
    map && props.details.bounds && map.fitBounds(props.details.bounds);
  }, [map, props.details.bounds]);

  if (!directionDetails) return null;
  const { closestTrip } = directionDetails;

  return (
    <>
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
        <form className="d-flex">
          {props.switchDirection ? (
            <a className="btn btn-sm mr-auto" onClick={props.switchDirection}>
              <Icon src={swapIcon} alt="" /> Switch direction
            </a>
          ) : null}
          <PlainDateTimeInput
            value={props.tripTime}
            onChange={props.onChangeTripTime}
          />
        </form>
      </div>
      <hr className="mt-10" />
      <StopTimesList
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
