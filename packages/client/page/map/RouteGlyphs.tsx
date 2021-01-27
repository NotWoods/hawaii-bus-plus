import React, { ReactNode, useContext } from 'react';
import { RouteDetailContext } from '../routes/context';
import { ShapeLine } from './ShapeLine';
import { StopMarkers } from './StopMarkers';

export function RouteGlyphs() {
  const { details, directionId } = useContext(RouteDetailContext);

  let shape: ReactNode = null;
  if (details) {
    const { trip } = details.directions[directionId].closestTrip;
    shape = (
      <ShapeLine
        shapeId={trip.shape_id}
        routeColor={details.route.route_color}
      />
    );
  }

  return (
    <>
      <StopMarkers highlighted={details?.stops} />
      {shape}
    </>
  );
}
