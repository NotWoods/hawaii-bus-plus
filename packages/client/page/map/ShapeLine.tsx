import { Shape } from '@hawaii-bus-plus/types';
import { Polyline } from '@react-google-maps/api';
import React, { useState } from 'react';
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
      try {
        const res = await fetch(`/api/v1/shapes/${props.shapeId}.json`, {
          signal,
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        const json = await res.json();
        setShape(json as Shape);
      } catch (err) {
        throw err;
      }
    },
    [props.shapeId]
  );

  if (!shape) return null;

  return (
    <Polyline
      path={shape.points.map((p) => p.position)}
      options={{ strokeColor: `#${props.routeColor}` }}
    />
  );
}
