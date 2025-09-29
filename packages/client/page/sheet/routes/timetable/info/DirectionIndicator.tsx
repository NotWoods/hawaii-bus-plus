import clsx from 'clsx';

import { useSelector } from '../../../../router/hooks';
import { selectLoadedDetails } from '../../../../router/selector/main';

export function DirectionIndicator() {
  const { directionId, directionIds } = useSelector(selectLoadedDetails);

  return (
    <div class="absolute bottom-0 inset-x-0 space-x-1 text-center">
      {Array.from(directionIds, (id) => (
        <span
          key={id}
          class={clsx(
            'inline-block w-1 h-1 rounded-sm motion-safe:transition',
            directionId === id ? 'bg-red' : 'bg-white/50 dark:bg-white/50',
          )}
        />
      ))}
    </div>
  );
}
