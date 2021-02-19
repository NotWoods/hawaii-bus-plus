import { DateString, TimeString } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import type { Temporal } from 'proposal-temporal';
import type { InfoWorkerHandler } from '../../worker-info/info';
import InfoWorker from '../../worker-info/info?worker';
import { useApiKey } from '../api/hook';
import { LoadingBar } from '../buttons/LoadingBar';
import { useDelay } from '../hooks/useDelay';
import { useLazyComponent } from '../hooks/useLazyComponent';
import { usePromise } from '../hooks/usePromise';
import { useWorker } from '../hooks/useWorker';
import { RouterContext } from '../router/Router';
import { RouterState, ROUTES_PREFIX } from '../router/state';
import { NOW } from '../time/input/symbol';
import { BaseSheet } from './BaseSheet';
import { colorVariables } from './props';
import { RouteHeader } from './RouteHeader';
import { RouteDetailContext } from './timetable/context';

const lazyTimetable = import('./time-entry');

function getRouteId({ main }: Pick<RouterState, 'main'>) {
  if (main?.path === ROUTES_PREFIX) {
    return main.routeId;
  } else {
    return undefined;
  }
}

export function RouteTimetable() {
  const state = useContext(RouterContext);
  const routeId = getRouteId(state);

  const delayDone = useDelay(500, [routeId]);
  const { details, directionId, setDetails, switchDirection } = useContext(
    RouteDetailContext
  );
  const { Timetable } = useLazyComponent(() => lazyTimetable);
  const [tripDate, setTripDate] = useState<Temporal.PlainDate | NOW>(NOW);
  const [tripTime, setTripTime] = useState<TimeString | undefined>();
  const apiKey = useApiKey();
  const postToInfoWorker = useWorker(InfoWorker) as InfoWorkerHandler;

  usePromise(
    async (signal) => {
      if (routeId && apiKey) {
        const details = await postToInfoWorker(signal, {
          type: 'route',
          apiKey,
          id: routeId,
          date:
            tripDate === NOW ? undefined : (tripDate.toString() as DateString),
          time: tripTime,
        });

        setDetails(details);
      } else {
        setDetails(undefined);
      }
    },
    [apiKey, routeId, tripTime]
  );

  const route = details?.route;
  if (route && Timetable) {
    return (
      <BaseSheet style={colorVariables(route)} loaded>
        <RouteHeader route={route} />
        <Timetable
          details={details!}
          directionId={directionId}
          tripDate={tripDate}
          onChangeTripDate={setTripDate}
          onChangeTripTime={setTripTime}
          switchDirection={switchDirection}
        />
      </BaseSheet>
    );
  } else if (routeId && delayDone) {
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
