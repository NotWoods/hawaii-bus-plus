import { h, Fragment } from 'preact';
import { Temporal } from 'proposal-temporal';
import { RouteDetails } from '../../../worker-info/route-details';
import { TripSelector } from '../trip/TripSelector';
import { SwitchDirectionButton } from './info/SwitchDirectionButton';
import { TimetableDetails } from './info/TimetableDetails';
import { StopTimeSegmentList } from './stop-time/StopTimeSegmentList';

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
