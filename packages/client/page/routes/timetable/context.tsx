import { createContext, h, ComponentChildren } from 'preact';
import { useState, StateUpdater } from 'preact/hooks';
import type { RouteDetails } from '../../../worker-info/route-details';
import type { TripDetails } from '../../../worker-info/trip-details';

export interface RouteDetailContext {
  details?: RouteDetails;
  selectedTrip?: TripDetails;
  directionId: 0 | 1;
  directionIds: ReadonlySet<0 | 1>;
  /**
   * Change the currently open route. Use undefined to close the route.
   */
  setDetails(details?: RouteDetails): void;
  /**
   * Set the direction to focus on for the given route.
   */
  setDirectionId: StateUpdater<0 | 1>;
  /**
   * Set a trip to focus on that is separate from the closest trip.
   */
  setSelectedTrip(trip?: TripDetails): void;
}

export const RouteDetailContext = createContext<RouteDetailContext>({
  directionId: 0,
  directionIds: new Set(),
  setDetails() {},
  setDirectionId() {},
  setSelectedTrip() {},
});

function validDirectionIds(directions?: readonly unknown[]) {
  const result = new Set<0 | 1>();
  if (directions) {
    if (directions[0] != undefined) {
      result.add(0);
    }
    if (directions[1] != undefined) {
      result.add(1);
    }
  }
  return result;
}

export function RouteDetailProvider(props: { children: ComponentChildren }) {
  const [details, setDetailState] = useState<RouteDetails | undefined>();

  const directionIds = validDirectionIds(details?.directions);
  const [directionId, setDirectionId] = useState<0 | 1>(0);

  const [selectedTrip, setSelectedTrip] = useState<TripDetails | undefined>();

  function setDetails(details?: RouteDetails) {
    setDetailState(details);
    if (selectedTrip?.trip?.route_id !== details?.route.route_id) {
      setSelectedTrip(undefined);
    }

    const [firstValidId = 0] = validDirectionIds(details?.directions);
    setDirectionId(firstValidId);
  }

  return (
    <RouteDetailContext.Provider
      value={{
        details,
        selectedTrip,
        directionId,
        directionIds,
        setDetails,
        setDirectionId,
        setSelectedTrip,
      }}
    >
      {props.children}
    </RouteDetailContext.Provider>
  );
}
