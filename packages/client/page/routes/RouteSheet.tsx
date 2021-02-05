import { h } from 'preact';
import { Temporal } from 'proposal-temporal';
import { useContext, useState } from 'preact/hooks';
import type { InfoWorkerHandler } from '../../worker-info/info';
import InfoWorker from '../../worker-info/info?worker';
import { databaseInitialized } from '../hooks/useDatabaseInitialized';
import { usePromise } from '../hooks/usePromise';
import { useWorker } from '../hooks/useWorker';
import { CloseButton } from '../page-wrapper/alert/CloseButton';
import { closeRouteAction } from '../router/action';
import { RouterContext } from '../router/Router';
import { RouteDetailContext } from './context';
import { colorVariables } from './props';
import { RouteDetailsCard } from './RouteDetails';
import { RouteName } from './RouteName';
import './RouteSheet.css';
import { TripDetails } from './trip/TripDetails';

function nowInZone(timeZone: string | Temporal.TimeZoneProtocol) {
  const now = Temporal.now.zonedDateTimeISO();
  return now.withTimeZone(timeZone).toPlainDateTime();
}

export function RouteSheet() {
  const { dispatch, routeId } = useContext(RouterContext);
  const { details, directionId, setDetails, switchDirection } = useContext(
    RouteDetailContext
  );
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
    return null;
  }

  return (
    <div
      className="route-sheet pointer-events-auto mx-10 border border-bottom-0 rounded-top bg-white bg-dark-light-dm"
      style={colorVariables(route)}
    >
      <div className="route-sheet__name px-card py-15 d-flex border-bottom rounded-top dark-mode">
        <h2 className="m-0 font-weight-medium">{RouteName(route)}</h2>
        <CloseButton
          className="ml-auto"
          onClick={() => dispatch(closeRouteAction())}
        />
      </div>
      <div className="row row-eq-spacing-lg">
        <div className="col-lg-8">
          <div className="content">
            {details && (
              <TripDetails
                details={details}
                directionId={directionId}
                tripTime={tripTime}
                switchDirection={switchDirection}
                onChangeTripTime={setTripTime}
              />
            )}
          </div>
        </div>
        <div className="col-lg-4">
          <RouteDetailsCard
            route={details?.route}
            agency={details?.agency}
            descParts={details?.descParts}
          />
        </div>
      </div>
    </div>
  );
}
