import { nowWithZone } from '@hawaii-bus-plus/utils';
import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import type { InfoWorkerHandler } from '../../worker-info/info';
import InfoWorker from '../../worker-info/info?worker';
import { LoadingBar } from '../buttons/LoadingBar';
import { databaseInitialized } from '../hooks/useDatabaseInitialized';
import { useDelay } from '../hooks/useDelay';
import { useLazyComponent } from '../hooks/useLazyComponent';
import { usePromise } from '../hooks/usePromise';
import { useWorker } from '../hooks/useWorker';
import { RouterContext } from '../router/Router';
import { BaseSheet } from './BaseSheet';
import { colorVariables } from './props';
import { RouteHeader } from './RouteHeader';
import { RouteDetailContext } from './timetable/context';

const lazyTimetable = import('./timetable/Timetable');

export function RouteTimetable() {
  const { routeId } = useContext(RouterContext);
  const delayDone = useDelay(500, [routeId]);
  const { details, directionId, setDetails, switchDirection } = useContext(
    RouteDetailContext
  );
  const { Timetable } = useLazyComponent(() => lazyTimetable);
  const [tripTime, setTripTime] = useState(() =>
    nowWithZone('Pacific/Honolulu')
  );
  const postToInfoWorker = useWorker(InfoWorker) as InfoWorkerHandler;

  usePromise(
    async (signal) => {
      if (routeId) {
        await databaseInitialized;
        const details = await postToInfoWorker(signal, {
          type: 'route',
          id: routeId,
          time: tripTime.toString(),
        });

        setDetails(details);
      } else {
        setDetails(undefined);
      }
    },
    [routeId, tripTime]
  );

  const route = details?.route;
  if (route && Timetable) {
    return (
      <BaseSheet style={colorVariables(route)} loaded>
        <RouteHeader route={route} />
        <Timetable
          details={details!}
          directionId={directionId}
          tripTime={tripTime}
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
