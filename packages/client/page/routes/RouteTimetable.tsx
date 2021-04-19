import { DateString } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import type { Temporal } from 'proposal-temporal';
import type { InfoWorkerHandler } from '../../worker-info/info';
import InfoWorker from '../../worker-info/info?worker';
import { RouteDetails } from '../../worker-info/route-details';
import { TripDetails } from '../../worker-info/trip-details';
import { LoadingBar } from '../buttons/LoadingBar';
import { useDelay, useLazyComponent, usePromise, useWorker } from '../hooks';
import { dbInitialized } from '../hooks/api';
import { useSelector } from '../router/hooks';
import { selectOpenRoute } from '../router/selector/main';
import { NOW, timeForWorker } from '../time/input/symbol';
import { BaseSheet } from './BaseSheet';
import { colorVariables } from './props';
import {
  closeRouteDetailsAction,
  setDefaultTripDetailsAction,
  setRouteDetailsAction,
  setTripDetailsAction,
} from './reducer/action';
import { RouteDetailContext } from './reducer/context';
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
  const showLoadingBar = useShowLoadingBar(routeId);

  const { Timetable } = useLazyComponent(() => lazyTimetable);

  const { details, dispatch } = useContext(RouteDetailContext);
  const [tripDate, setTripDate] = useState<Temporal.PlainDate | NOW>(NOW);

  usePromise(
    async (signal) => {
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
    },
    [routeId, tripDate, dispatch],
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

  const route = details?.route;
  if (route && Timetable) {
    return (
      <BaseSheet style={colorVariables(route)} loaded>
        <RouteHeader route={route} showClose />
        <Timetable
          details={details!}
          tripDate={tripDate}
          onChangeTripDate={setTripDate}
        />
      </BaseSheet>
    );
  } else if (showLoadingBar) {
    return (
      <BaseSheet>
        <RouteHeader />
        <LoadingBar />
      </BaseSheet>
    );
  } else {
    return null;
  }
}
