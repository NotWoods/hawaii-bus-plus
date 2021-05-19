import { Trip } from '@hawaii-bus-plus/types';
import { Fragment, h } from 'preact';
import type { Temporal } from 'proposal-temporal';
import type { RouteDetails } from '../../../worker-info/route-details';
import { DirectionDetails } from '../../../worker-info/trip-details';
import { LoadingBar } from '../../loading/LoadingBar';
import { useDelay } from '../../hooks';
import { setTripAction } from '../../router/action/main';
import { resetTripAction } from '../../router/action/routes';
import { useDispatch, useSelector } from '../../router/hooks';
import {
  selectLoadedDetails,
  selectOpenRoute,
} from '../../router/selector/main';
import { NOW } from '../../time/input/symbol';
import { TimetableDetails } from './info/TimetableDetails';
import { TripName } from './info/TripName';
import { TripSelector } from './info/TripSelector';
import { RouteDetailsCard } from './RouteDetails';
import { StopTimeSegmentList } from './stop-time/StopTimeSegmentList';

interface Props {
  routeDetails: RouteDetails;
  tripDate: Temporal.PlainDate | NOW;
  onChangeTripDate(time: Temporal.PlainDate): void;
}

function useOpenTrip() {
  const dispatch = useDispatch();
  const { routeId, tripId } = useSelector(selectOpenRoute);

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
  directionsDetails: readonly DirectionDetails[],
) {
  for (const dirDetails of directionsDetails) {
    const tripSlice = dirDetails.allTrips.get(tripId);
    if (tripSlice) {
      return tripSlice.shortName;
    }
  }
  return undefined;
}

export function Timetable({ routeDetails, tripDate, onChangeTripDate }: Props) {
  const { tripId, setSelectedTrip } = useOpenTrip();
  const { directionId, selectedTrip } = useSelector(selectLoadedDetails);
  const tripInfoLoading = useDelay(500, [tripId]);

  const directionsDetails = routeDetails.directions;
  const directionDetails = directionsDetails[directionId];
  const selectedTripId = tripId ?? directionDetails.closestTrip.trip.trip_id;

  const { route, agency } = routeDetails;

  return (
    <>
      <div class="flex flex-wrap-reverse gap-4 m-4">
        <TripSelector
          directionHeaders={route.directions}
          directionsDetails={directionsDetails}
          tripDate={tripDate}
          selectedTripId={selectedTripId}
          onChangeTripDate={onChangeTripDate}
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
          agency={agency}
        />
      )}
      {tripId && !selectedTrip && tripInfoLoading ? <LoadingBar /> : null}
      <StopTimeSegmentList
        stopTimes={(selectedTrip ?? directionDetails.closestTrip).stopTimes}
        timeZone={agency.agency_timezone}
      />
      <RouteDetailsCard
        route={route}
        agency={agency}
        descParts={routeDetails.descParts}
        tripId={selectedTripId}
      />
    </>
  );
}
