import { DateString } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import type { Temporal } from 'proposal-temporal';
import { colorVariables } from '../../../all-pages/route-colors';
import { RouteDetails } from '../../../worker-info/route-details';
import { TripDetails } from '../../../worker-info/trip-details';
import type { InfoWorkerHandler } from '../../../worker-info/worker-info';
import { useDelay, useLazyComponent, usePromise, useWorker } from '../../hooks';
import { dbInitialized } from '../../api';
import { LoadingBusIcon } from '../../loading/LoadingBusIcon';
import {
  closeRouteDetailsAction,
  setDefaultTripDetailsAction,
  setRouteDetailsAction,
  setTripDetailsAction
} from '../../router/action/routes';
import { useDispatch, useSelector } from '../../router/hooks';
import { selectOpenRoute, selectRouteDetails } from '../../router/selector/main';
import { NOW, timeForWorker } from '../../time/input/symbol';
import InfoWorker from '../../../worker-info/worker-info?worker';
import { BaseSheet } from './BaseSheet';
import { RouteHeader } from './RouteHeader';

const lazyTimetable = import('./time-entry');

/**
 * runs a timer to show a loading bar if it takes too long to load the full route data.
 */
function useShowLoadingBar(routeId: unknown) {
  const delayDone = useDelay(500, [routeId]);
  return routeId && delayDone;
}

export function RouteTimetable() {
  const postToInfoWorker = useWorker(InfoWorker) as InfoWorkerHandler;
  const { routeId, tripId } = useSelector(selectOpenRoute);
  const routeDetails = useSelector(selectRouteDetails);
  const [tripDate, setTripDate] = useState<Temporal.PlainDate | NOW>(NOW);

  const dispatch = useDispatch();
  const showLoadingBar = useShowLoadingBar(routeId);

  const { Timetable } = useLazyComponent(() => lazyTimetable);

  usePromise(
    async (signal) => {
      if (routeId !== routeDetails?.route?.route_id) {
        let details: RouteDetails | undefined;
        if (routeId) {
          await dbInitialized;
          details = await postToInfoWorker(signal, {
            type: 'route',
            routeId,
            date: timeForWorker(tripDate) as DateString | undefined,
          });
        }

        if (details) {
          dispatch(setRouteDetailsAction(details));
        } else {
          dispatch(closeRouteDetailsAction());
        }
      }
    },
    [routeId, tripDate, routeDetails, dispatch],
  );

  usePromise(
    async (signal) => {
      let details: TripDetails | undefined;
      if (routeId && tripId) {
        await dbInitialized;
        details = await postToInfoWorker(signal, {
          type: 'trip',
          routeId,
          tripId,
          date: timeForWorker(tripDate) as DateString | undefined,
        });
      }

      if (details) {
        dispatch(setTripDetailsAction(details));
      } else {
        dispatch(setDefaultTripDetailsAction());
      }
    },
    [routeId, tripId, tripDate, dispatch],
  );

  const route = routeDetails?.route;
  if (route && Timetable) {
    return (
      <BaseSheet style={colorVariables(route)} loaded>
        <RouteHeader route={route} showClose />
        <Timetable
          routeDetails={routeDetails!}
          tripDate={tripDate}
          onChangeTripDate={setTripDate}
        />
      </BaseSheet>
    );
  } else if (showLoadingBar) {
    return (
      <BaseSheet>
        <RouteHeader />
        <LoadingBusIcon />
      </BaseSheet>
    );
  } else {
    return null;
  }
}
