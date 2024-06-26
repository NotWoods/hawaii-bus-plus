import { Polyline } from '@hawaii-bus-plus/react-google-maps';
import type { ColorString, Shape } from '@hawaii-bus-plus/types';

import { useMemo, useState } from 'preact/hooks';
import { usePromise, Warning } from '../hooks';

interface Props {
  shapeId?: Shape['shape_id'];
  edges?: readonly [number, number];
  routeColor: ColorString;
}

function useShape(shapeId: Shape['shape_id'] | undefined): Shape | undefined {
  const [shape, setShape] = useState<Shape | undefined>();

  usePromise(
    async (signal) => {
      setShape(undefined);
      if (!shapeId) return;

      try {
        const res = await fetch(`/api/v1/shapes/${shapeId}.json`, {
          signal,
          credentials: 'same-origin',
        });
        const json = await res.json();
        setShape(json as Shape);
      } catch (err: unknown) {
        if (err instanceof TypeError) {
          // fetching issue
          throw new Warning(`Couldn't download route appearance data`);
        } else if (err instanceof SyntaxError) {
          // JSON issue
          throw new Error(`Couldn't read route appearance data`);
        } else {
          throw err;
        }
      }
    },
    [shapeId],
  );

  return shape;
}

export function ShapeLine(props: Props) {
  const shape = useShape(props.shapeId);

  const options = useMemo(
    () => ({ strokeColor: props.routeColor }),
    [props.routeColor],
  );

  if (!shape) return null;

  let { points } = shape;
  if (props.edges) {
    const [start, end] = props.edges;
    points = shape.points.filter(
      (p) => start <= p.shape_dist_traveled && p.shape_dist_traveled <= end,
    );
  }

  return <Polyline path={points.map((p) => p.position)} options={options} />;
}
