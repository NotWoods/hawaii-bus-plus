import { h } from 'preact';
import { useApi } from '../hooks/useApi';
import { MenuIcon } from '../icons/MenuIcon';
import { RouteLinkVertical } from '../routes/link/RouteListItem';
import { SearchBar } from '../search/SearchBar';
import { SearchBase } from '../search/SearchBase';

interface Props {
  onSearch?(): void;
}

export function Home(props: Props) {
  const api = useApi();
  const routes = api?.routes ?? [];

  return (
    <SearchBase icon={<MenuIcon />}>
      <h2 class="font-display font-medium text-xl text-center text-white">
        Aloha kakahiaka
      </h2>
      <SearchBar onClick={props.onSearch} />
      <ul
        class="mt-12 grid grid-flow-col md:grid-flow-row md:grid-cols-2 gap-4 overflow-auto px-4 scroll-snap scroll-px-8 overscroll-contain"
        style="scroll-padding-inline: 2rem; scroll-snap-type: both mandatory"
      >
        {routes.map((route) => (
          <li key={route.route_id}>
            <RouteLinkVertical
              route={route}
              agency={api!.agency[route.agency_id]}
            />
          </li>
        ))}
      </ul>
    </SearchBase>
  );
}
