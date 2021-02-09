import { nowWithZone } from '@hawaii-bus-plus/utils';
import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import type { InfoWorkerHandler } from '../../worker-info/info';
import InfoWorker from '../../worker-info/info?worker';
import { LoadingBar } from '../buttons/LoadingBar';
import { databaseInitialized } from '../hooks/useDatabaseInitialized';
import { useDelay } from '../hooks/useDelay';
import { usePromise } from '../hooks/usePromise';
import { useWorker } from '../hooks/useWorker';
import { RouterContext } from '../router/Router';
import { colorVariables } from './props';
import { RouteHeader } from './RouteHeader';
import { RouteDetailContext } from './timetable/context';
import { Timetable } from './timetable/Timetable';

export function RouteTimetable() {
  const { routeId } = useContext(RouterContext);
  const delayDone = useDelay(500, [routeId]);
  const { details, directionId, setDetails, switchDirection } = useContext(
    RouteDetailContext
  );
  const [tripTime, setTripTime] = useState(() =>
    nowWithZone('Pacific/Honolulu')
  );
  const postToInfoWorker = useWorker(InfoWorker) as InfoWorkerHandler;

  usePromise(async () => {
    if (routeId) {
      await databaseInitialized;
      const details = await postToInfoWorker({
        type: 'route',
        id: routeId,
        time: tripTime.toString(),
      });

      setDetails(details);
    } else {
      setDetails(undefined);
    }
  }, [routeId, tripTime]);

  const route = details?.route;
  if (route) {
    return (
      <article class="bg-gray-50" style={colorVariables(route)}>
        <RouteHeader route={route} />
        <Timetable
          details={details!}
          directionId={directionId}
          tripTime={tripTime}
          onChangeTripTime={setTripTime}
          switchDirection={switchDirection}
        />
      </article>
    );
  } else if (routeId && delayDone) {
    return (
      <article class="bg-gray-50">
        <RouteHeader />
        <LoadingBar />
      </article>
    );
  } else {
    return null;
  }
}
