import { Trip } from '@hawaii-bus-plus/types';
import { Fragment, h } from 'preact';
import { useContext } from 'preact/hooks';
import type { Temporal } from 'proposal-temporal';
import type { RouteDetails } from '../../../worker-info/route-details';
import { DirectionDetails } from '../../../worker-info/trip-details';
import { LoadingBar } from '../../buttons/LoadingBar';
import { useDelay } from '../../hooks';
import { resetTripAction, setTripAction } from '../../router/action/main';
import { RouterContext } from '../../router/Router';
import { selectOpenRoute } from '../../router/selector/main';
import { NOW } from '../../time/input/symbol';
import { RouteDetailContext } from './context';
import { TimetableDetails } from './info/TimetableDetails';
import { TripName } from './info/TimetableDirectionsDetail';
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
    setSelectedTrip(tripId: Trip['trip_id'] | NOW) {
      if (tripId === NOW) {
        dispatch(resetTripAction());
      } else {
        dispatch(setTripAction(routeId!, tripId));
      }
    },
  };
}

function shortNameFromTripSlice(
  tripId: Trip['trip_id'],
  directionsDetails: readonly DirectionDetails[]
) {
  for (const dirDetails of directionsDetails) {
    const tripSlice = dirDetails.allTrips.get(tripId);
    if (tripSlice) {
      return tripSlice.shortName;
    }
  }
  return undefined;
}

export function Timetable(props: Props) {
  const { details, tripDate } = props;
  const { tripId, setSelectedTrip } = useOpenTrip();
  const { directionId, selectedTrip } = useContext(RouteDetailContext);
  const tripInfoLoading = useDelay(500, [tripId]);

  const directionsDetails = details.directions;
  const directionDetails = directionsDetails[directionId];
  const selectedTripId = tripId ?? directionDetails.closestTrip.trip.trip_id;

  useTripBounds(details.bounds);

  return (
    <>
      <div class="flex flex-wrap-reverse gap-4 m-4">
        <TripSelector
          directionHeaders={details.route.directions}
          directionsDetails={directionsDetails}
          tripDate={tripDate}
          selectedTripId={selectedTripId}
          onChangeTripDate={props.onChangeTripDate}
          setSelectedTrip={setSelectedTrip}
        />
      </div>
      {tripId ? (
        <TripName
          tripShortName={
            selectedTrip
              ? selectedTrip.trip.trip_short_name
              : shortNameFromTripSlice(tripId, directionsDetails)
          }
          serviceDays={selectedTrip?.serviceDays}
        />
      ) : (
        <TimetableDetails
          directionsDetails={directionsDetails}
          agency={details.agency}
        />
      )}
      {tripId && !selectedTrip && tripInfoLoading ? <LoadingBar /> : null}
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
