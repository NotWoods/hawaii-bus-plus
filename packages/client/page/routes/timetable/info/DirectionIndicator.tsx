import clsx from 'clsx';
import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { RouteDetailContext } from '../context';

export function DirectionIndicator() {
  const { directionId, directionIds } = useContext(RouteDetailContext);

  return (
    <div class="absolute bottom-0 inset-x-0 space-x-1 text-center">
      {Array.from(directionIds, (id) => (
        <span
          key={id}
          class={clsx(
            'inline-block w-1 h-1 rounded transition',
            directionId === id
              ? 'bg-red'
              : 'bg-opacity-50 dark:bg-opacity-50 bg-white dark:bg-white'
          )}
        />
      ))}
    </div>
  );
}
