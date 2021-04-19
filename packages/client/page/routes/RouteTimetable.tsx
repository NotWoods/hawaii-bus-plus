import { DateString } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import type { Temporal } from 'proposal-temporal';
import type { InfoWorkerHandler } from '../../worker-info/info';
import InfoWorker from '../../worker-info/info?worker';
import { LoadingBar } from '../buttons/LoadingBar';
import { useDelay, useLazyComponent, usePromise, useWorker } from '../hooks';
import { dbInitialized } from '../hooks/api';
import { useSelector } from '../router/hooks';
import { selectOpenRoute } from '../router/selector/main';
import { NOW, timeForWorker } from '../time/input/symbol';
import { BaseSheet } from './BaseSheet';
import { colorVariables } from './props';
import { RouteHeader } from './RouteHeader';
import { RouteDetailContext } from './timetable/context';

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

  const { details, setDetails, setSelectedTrip } = useContext(
    RouteDetailContext,
  );
  const [tripDate, setTripDate] = useState<Temporal.PlainDate | NOW>(NOW);

  usePromise(
    async (signal) => {
      if (routeId) {
        await dbInitialized;
        const details = await postToInfoWorker(signal, {
          type: 'route',
          routeId,
          date: timeForWorker(tripDate) as DateString | undefined,
        });

        setDetails(details);
      } else {
        setDetails(undefined);
      }
    },
    [routeId, tripDate],
  );

  usePromise(
    async (signal) => {
      if (routeId && tripId) {
        await dbInitialized;
        const details = await postToInfoWorker(signal, {
          type: 'trip',
          routeId,
          tripId,
          date: timeForWorker(tripDate) as DateString | undefined,
        });

        setSelectedTrip(details);
      } else {
        setSelectedTrip(undefined);
      }
    },
    [routeId, tripId, tripDate],
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
