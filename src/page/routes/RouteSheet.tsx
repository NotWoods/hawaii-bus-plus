import React, { useContext } from 'react';
import { useApi } from '../data/Api';
import { RouterContext } from '../router/Router';
import { colorProps } from './props';
import { RouteName } from './RouteName';
import { StopTimesList } from './trip/StopTimesList';
import './RouteSheet.css';
import { closeRouteAction } from '../router/action';
import { Icon } from '../icons/Icon';
import swapIcon from '../icons/swap_horiz.svg';
import { RouteDetails } from './RouteDetails';

export function RouteSheet() {
  const { route_id, route: routeData, dispatch } = useContext(RouterContext);
  const api = useApi();
  const route =
    routeData || (route_id && api ? api.routes[route_id] : undefined);

  if (!route) {
    return null;
  }

  const { backgroundColor } = colorProps(route);
  const firstTrip = route.trips[Object.keys(route.trips)[0]];
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
            <div className="">
              <h3 className="content-title m-0">{firstTrip.trip_short_name}</h3>
              <p className="mt-0">{firstTrip.stop_times.length} stops</p>
              <a className="btn btn-sm">
                <Icon src={swapIcon} alt="" /> Switch direction
              </a>
            </div>
            <hr className="mt-10" />
            <StopTimesList
              routeId={route.route_id}
              stopTimes={firstTrip.stop_times}
            />
          </div>
        </div>
        <div className="col-lg-4">
          <RouteDetails route={route} />
        </div>
      </div>
    </div>
  );
}
