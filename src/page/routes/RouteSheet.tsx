import React, { useContext, useState } from 'react';
import InfoWorker from '../../worker-info/info?worker';
import { RouteDetails } from '../../worker-info/route-details';
import { dbInitialized } from '../data/db-ready';
import { usePromise } from '../hooks/usePromise';
import { useWorker } from '../hooks/useWorker';
import { Icon } from '../icons/Icon';
import swapIcon from '../icons/swap_horiz.svg';
import { closeRouteAction } from '../router/action';
import { RouterContext } from '../router/Router';
import { colorProps } from './props';
import { RouteDetailsCard } from './RouteDetails';
import { RouteName } from './RouteName';
import './RouteSheet.css';
import { StopTimesList } from './trip/StopTimesList';

export function RouteSheet() {
  const { route_id, route: routeData, dispatch } = useContext(RouterContext);
  const [details, setDetails] = useState<RouteDetails | undefined>();
  const infoWorker = useWorker(InfoWorker);

  usePromise(async () => {
    if (!route_id) return;

    await dbInitialized;
    const details = await infoWorker?.postMessage({
      type: 'route',
      id: route_id,
    });

    setDetails(details as RouteDetails | undefined);
  }, [route_id]);

  const route = details?.route || routeData;

  if (!route) {
    return null;
  }

  const { backgroundColor } = colorProps(route);
  const trip = details && details.route.trips[details.closestTrip.id];
  const cssVars = {
    '--route-color': backgroundColor,
    '--route-text-color': `#${route.route_text_color}`,
  };

  return (
    <div
      className="route-sheet pointer-events-auto mx-10 border border-bottom-0 rounded-top bg-white bg-dark-light-dm"
      style={cssVars as any}
    >
      <div className="route-sheet__name px-card py-15 d-flex border-bottom rounded-top dark-mode">
        <h2 className="m-0 font-size-24 font-weight-bold">
          <RouteName route={route} />
        </h2>
        <button
          className="btn btn-square ml-auto text-reset"
          type="button"
          onClick={() => dispatch(closeRouteAction())}
        >
          &times;
        </button>
      </div>
      <div className="row row-eq-spacing-lg">
        <div className="col-lg-8">
          {trip ? (
            <div className="content">
              <div className="">
                <h3 className="content-title m-0">{trip.trip_short_name}</h3>
                <p className="mt-0">{trip.stop_times.length} stops</p>
                <a className="btn btn-sm">
                  <Icon src={swapIcon} alt="" /> Switch direction
                </a>
              </div>
              <hr className="mt-10" />
              <StopTimesList
                routeId={route.route_id}
                stopTimes={trip.stop_times}
              />
            </div>
          ) : (
            <div className="content" />
          )}
        </div>
        <div className="col-lg-4">
          <RouteDetailsCard
            route={details?.route}
            descParts={details?.descParts}
          />
        </div>
      </div>
    </div>
  );
}
