import { Polyline } from '@hawaii-bus-plus/react-google-maps';
import { Shape } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { usePromise } from '../hooks/usePromise';

interface Props {
  shapeId?: Shape['shape_id'];
  routeColor: string;
}

export function ShapeLine(props: Props) {
  const [shape, setShape] = useState<Shape | undefined>();

  usePromise(
    async (signal) => {
      setShape(undefined);
      if (!props.shapeId) return;

      const apiKey = localStorage.getItem('api-key');
      const res = await fetch(`/api/v1/shapes/${props.shapeId}.json`, {
        signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      const json = await res.json();
      setShape(json as Shape);
    },
    [props.shapeId]
  );

  const options = useMemo(() => ({ strokeColor: `#${props.routeColor}` }), [
    props.routeColor,
  ]);

  if (!shape) return null;

  return (
    <Polyline path={shape.points.map((p) => p.position)} options={options} />
  );
}
