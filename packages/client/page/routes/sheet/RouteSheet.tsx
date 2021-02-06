import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { Temporal } from 'proposal-temporal';
import type { InfoWorkerHandler } from '../../../worker-info/info';
import InfoWorker from '../../../worker-info/info?worker';
import { databaseInitialized } from '../../hooks/useDatabaseInitialized';
import { useDelay } from '../../hooks/useDelay';
import { usePromise } from '../../hooks/usePromise';
import { useWorker } from '../../hooks/useWorker';
import { RouterContext } from '../../router/Router';
import { colorVariables } from '../props';
import { RouteDetailContext } from './context';
import './RouteSheet.css';
import { RouteSheetContent } from './RouteSheetContent';
import { RouteSheetHeader } from './RouteSheetHeader';

function nowInZone(timeZone: string | Temporal.TimeZoneProtocol) {
  const now = Temporal.now.zonedDateTimeISO();
  return now.withTimeZone(timeZone).toPlainDateTime();
}

export function RouteSheet() {
  const { routeId } = useContext(RouterContext);
  const delayDone = useDelay(500, [routeId]);
  const { details, setDetails } = useContext(RouteDetailContext);
  const [tripTime, setTripTime] = useState(() => nowInZone('Pacific/Honolulu'));
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
  if (!route) {
    if (routeId && delayDone) {
      return (
        <div className="route-sheet pointer-events-auto mx-10 border border-bottom-0 rounded-top bg-white bg-dark-light-dm">
          <RouteSheetHeader />
          <div class="progress m-15">
            <div
              class="progress-bar progress-bar-animated"
              role="progressbar"
              style="width: 100%"
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  return (
    <div
      className="route-sheet pointer-events-auto mx-10 border border-bottom-0 rounded-top bg-white bg-dark-light-dm"
      style={colorVariables(route)}
    >
      <RouteSheetHeader route={route} />
      <RouteSheetContent tripTime={tripTime} setTripTime={setTripTime} />
    </div>
  );
}
