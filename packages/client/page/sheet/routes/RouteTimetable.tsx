import type { DateString, Route } from '@hawaii-bus-plus/types';

import { useState } from 'preact/hooks';
import type { Temporal } from '@js-temporal/polyfill';
import { colorVariables } from '../../../components/route-colors';
import { RouteHeader } from '../../../components/RouteHeader/RouteHeader';
import {
  InfoWorker,
  type InfoWorkerHandler,
  type RouteDetails,
  type TripDetails,
} from '@hawaii-bus-plus/workers/info';
import { dbInitialized } from '../../api';
import { useDelay, usePromise, useWorker } from '../../hooks';
import { LoadingBusIcon } from '../../loading/LoadingBusIcon';
import { closeMainAction } from '../../router/action/main';
import {
  closeRouteDetailsAction,
  setDefaultTripDetailsAction,
  setRouteDetailsAction,
  setTripDetailsAction,
} from '../../router/action/routes';
import { useDispatch, useSelector } from '../../router/hooks';
import {
  selectOpenRoute,
  selectRouteDetails,
} from '../../router/selector/main';
import { NOW, timeForWorker } from '../../time/input/symbol';
import { BaseSheet } from '../BaseSheet';
import { lazy, Suspense } from 'preact/compat';
import { SnackbarErrorBoundary } from '../../loading/SnackbarErrorBoundary';

const lazyTimetable = import('./time-entry');
const Timetable = lazy(async () => (await lazyTimetable).Timetable);

/**
 * runs a timer to show a loading bar if it takes too long to load the full route data.
 */
function useShowLoadingBar(routeId: unknown) {
  const delayDone = useDelay(500, [routeId]);
  return routeId && delayDone;
}

function Header({ route }: { route?: Route }) {
  const dispatch = useDispatch();

  return (
    <RouteHeader route={route} onClose={() => dispatch(closeMainAction())} />
  );
}

export function RouteTimetable() {
  const postToInfoWorker = useWorker(InfoWorker) as InfoWorkerHandler;
  const { routeId, tripId } = useSelector(selectOpenRoute);
  const routeDetails = useSelector(selectRouteDetails);
  const [tripDate, setTripDate] = useState<Temporal.PlainDate | NOW>(NOW);

  const dispatch = useDispatch();
  const showLoadingBar = useShowLoadingBar(routeId);

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
  if (route) {
    return (
      <BaseSheet style={colorVariables(route)} loaded>
        <Header route={route} />
        <SnackbarErrorBoundary fallback={null}>
          <Suspense fallback={showLoadingBar ? <LoadingBusIcon /> : null}>
            <Timetable
              routeDetails={routeDetails}
              tripDate={tripDate}
              onChangeTripDate={setTripDate}
            />
          </Suspense>
        </SnackbarErrorBoundary>
      </BaseSheet>
    );
  } else if (showLoadingBar) {
    return (
      <BaseSheet>
        <Header />
        <LoadingBusIcon />
      </BaseSheet>
    );
  } else {
    return null;
  }
}
