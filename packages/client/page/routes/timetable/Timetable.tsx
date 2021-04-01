import { Trip } from '@hawaii-bus-plus/types';
import { Fragment, h } from 'preact';
import { useContext } from 'preact/hooks';
import type { Temporal } from 'proposal-temporal';
import type { RouteDetails } from '../../../worker-info/route-details';
import { setTripAction } from '../../router/action/main';
import { RouterContext } from '../../router/Router';
import { selectOpenRoute } from '../../router/selector/main';
import { NOW } from '../../time/input/symbol';
import { RouteDetailContext } from './context';
import { SwitchDirectionButton } from './info/SwitchDirectionButton';
import { TimetableDetails, TripName } from './info/TimetableDetails';
import { TripSelector } from './info/TripSelector';
import { RouteDetailsCard } from './RouteDetails';
import { StopTimeSegmentList } from './stop-time/StopTimeSegmentList';
import { useTripBounds } from './useTripBounds';

interface Props {
  details: RouteDetails;
  tripDate: Temporal.PlainDate | NOW;
  onChangeTripDate(time: Temporal.PlainDate): void;
}

function useOpenTrip() {
  const state = useContext(RouterContext);
  const { dispatch } = state;
  const { routeId, tripId } = selectOpenRoute(state) ?? {};

  return {
    tripId,
    setSelectedTrip(tripId: Trip['trip_id']) {
      dispatch(setTripAction(routeId!, tripId));
    },
  };
}

export function Timetable(props: Props) {
  const { details, tripDate } = props;
  const { tripId, setSelectedTrip } = useOpenTrip();
  const { directionId, selectedTrip } = useContext(RouteDetailContext);

  const directionDetails = details.directions[directionId];
  const selectedTripId = tripId ?? directionDetails.closestTrip.trip.trip_id;
  console.log(selectedTripId, directionId, details.directions);

  useTripBounds(details.bounds);

  return (
    <>
      <div class="flex flex-wrap-reverse gap-4 m-4">
        <SwitchDirectionButton class="mr-auto" />
        <TripSelector
          directionsDetails={details.directions}
          tripDate={tripDate}
          selectedTripId={selectedTripId}
          onChangeTripDate={props.onChangeTripDate}
          setSelectedTrip={setSelectedTrip}
        />
      </div>
      {tripId ? (
        <TripName details={selectedTrip} />
      ) : (
        <TimetableDetails
          directionDetails={directionDetails}
          agency={details.agency}
        />
      )}
      <StopTimeSegmentList
        stopTimes={(selectedTrip ?? directionDetails.closestTrip).stopTimes}
        timeZone={details.agency.agency_timezone}
      />
      <RouteDetailsCard
        route={details.route}
        agency={details.agency}
        descParts={details.descParts}
        tripId={selectedTripId}
      />
    </>
  );
}
