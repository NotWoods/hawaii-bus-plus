import React, { useContext, useState } from 'react';
import InfoWorker from '../../worker-info/info?worker';
import type { RouteDetails } from '../../worker-info/route-details';
import { dbInitialized } from '../data/db-ready';
import { usePromise } from '../hooks/usePromise';
import { useWorker } from '../hooks/useWorker';
import { closeRouteAction } from '../router/action';
import { RouterContext } from '../router/Router';
import { colorProps } from './props';
import { RouteDetailsCard } from './RouteDetails';
import { RouteName } from './RouteName';
import './RouteSheet.css';
import { TripDetails } from './trip/TripDetails';

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
          <div className="content">
            {details ? <TripDetails details={details} /> : null}
          </div>
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
