import { ComponentChildren, h, Fragment } from 'preact';
import { useContext } from 'preact/hooks';
import { RouteDetailContext } from '../routes/sheet/context';
import { ShapeLine } from './ShapeLine';
import { StopMarkers } from './StopMarkers';

interface Props {
  darkMode?: boolean;
}

export function RouteGlyphs({ darkMode }: Props) {
  const { details, directionId } = useContext(RouteDetailContext);

  let shape: ComponentChildren = null;
  if (details) {
    const shapeId =
      details.directions[directionId]?.closestTrip?.trip?.shape_id;
    shape = (
      <ShapeLine shapeId={shapeId} routeColor={details.route.route_color} />
    );
  }

  return (
    <>
      <StopMarkers
        highlighted={details?.stops}
        highlightColor={
          details?.route?.route_color && `#${details.route.route_color}`
        }
        darkMode={darkMode}
      />
      {shape}
    </>
  );
}
