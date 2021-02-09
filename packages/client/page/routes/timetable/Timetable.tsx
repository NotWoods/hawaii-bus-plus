import { h, Fragment } from 'preact';
import { Temporal } from 'proposal-temporal';
import { RouteDetails } from '../../../worker-info/route-details';
import { SwitchDirectionButton } from './info/SwitchDirectionButton';
import { TimetableDetails } from './info/TimetableDetails';
import { TripSelector } from './info/TripSelector';
import { StopTimeSegmentList } from './stop-time/StopTimeSegmentList';
import { useTripBounds } from './useTripBounds';

interface Props {
  details: RouteDetails;
  directionId: number;
  tripTime: Temporal.PlainDateTime;
  onChangeTripTime(time: Temporal.PlainDateTime): void;
  switchDirection?(): void;
}

export function Timetable(props: Props) {
  const { details, tripTime, directionId } = props;
  const directionDetails = details.directions[directionId];

  useTripBounds(details.bounds);

  return (
    <>
      <TripSelector
        details={directionDetails}
        tripTime={tripTime}
        onChangeTripTime={props.onChangeTripTime}
      />
      <SwitchDirectionButton switchDirection={props.switchDirection} />
      <TimetableDetails
        details={details}
        directionId={directionId}
        tripTime={tripTime}
      />
      <StopTimeSegmentList
        stopTimes={directionDetails.closestTrip.stopTimes}
        timeZone={details.agency.agency_timezone}
      />
    </>
  );
}
