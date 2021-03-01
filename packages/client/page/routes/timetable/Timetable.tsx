import { TimeString } from '@hawaii-bus-plus/types';
import { Fragment, h } from 'preact';
import type { Temporal } from 'proposal-temporal';
import type { RouteDetails } from '../../../worker-info/route-details';
import { NOW } from '../../time/input/symbol';
import { SwitchDirectionButton } from './info/SwitchDirectionButton';
import { TimetableDetails } from './info/TimetableDetails';
import { TripSelector } from './info/TripSelector';
import { RouteDetailsCard } from './RouteDetails';
import { StopTimeSegmentList } from './stop-time/StopTimeSegmentList';
import { useTripBounds } from './useTripBounds';

interface Props {
  details: RouteDetails;
  directionId: number;
  tripDate: Temporal.PlainDate | NOW;
  onChangeTripDate(time: Temporal.PlainDate): void;
  onChangeTripTime(time: TimeString): void;
  switchDirection?(): void;
}

export function Timetable(props: Props) {
  const { details, tripDate, directionId } = props;
  const directionDetails = details.directions[directionId];

  useTripBounds(details.bounds);

  return (
    <>
      <div class="flex flex-wrap-reverse gap-4 m-4">
        <SwitchDirectionButton
          class="mr-auto"
          switchDirection={props.switchDirection}
        />
        <TripSelector
          details={directionDetails}
          tripDate={tripDate}
          onChangeTripDate={props.onChangeTripDate}
          onChangeTripTime={props.onChangeTripTime}
        />
      </div>
      <TimetableDetails details={details} directionId={directionId} />
      <StopTimeSegmentList
        stopTimes={directionDetails.closestTrip.stopTimes}
        timeZone={details.agency.agency_timezone}
      />
      <RouteDetailsCard
        route={details.route}
        agency={details.agency}
        descParts={details.descParts}
      />
    </>
  );
}
