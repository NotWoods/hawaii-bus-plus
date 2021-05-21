import { Agency, Route } from '@hawaii-bus-plus/types';
import clsx, { ClassValue } from 'clsx';
import { h } from 'preact';
import { useScreens } from '../../hooks';
import { useListKeyboardNav } from '../../hooks/useListKeyboardNav';
import { RouteLinkVertical } from '../../sheet/routes/link/RouteListItem';

interface Props {
  routes: readonly Route[];
  agencies: ReadonlyMap<Agency['agency_id'], Agency>;
  class?: ClassValue;
}

export function NearbyRoutes(props: Props) {
  const twoColumns = useScreens('md');

  const handleArrowKey = useListKeyboardNav(
    (evt, listItem) => {
      switch (evt.key) {
        case 'ArrowUp':
          if (twoColumns) {
            return listItem.previousElementSibling?.previousElementSibling;
          }
          break;
        case 'ArrowDown':
          if (twoColumns) {
            return listItem.nextElementSibling?.nextElementSibling;
          }
          break;
        case 'ArrowLeft':
          return listItem.previousElementSibling;
        case 'ArrowRight':
          return listItem.nextElementSibling;
      }
      return undefined;
    },
    [twoColumns],
  );

  return (
    <ul
      class={clsx(
        'grid grid-flow-col auto-cols-min md:grid-flow-row md:grid-cols-2 gap-4 px-4 snap snap-px-32 overflow-auto overscroll-contain',
        props.class,
      )}
      onKeyDown={handleArrowKey}
    >
      {props.routes.map((route) => (
        <li key={route.route_id}>
          <RouteLinkVertical
            route={route}
            agency={props.agencies.get(route.agency_id)!}
          />
        </li>
      ))}
    </ul>
  );
}
