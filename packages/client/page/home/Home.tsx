import { h } from 'preact';
import { IconButton } from '../buttons/IconButton';
import { useApi } from '../hooks/useApi';
import { MenuIcon } from '../icons/MenuIcon';
import { RouteLinkVertical } from '../routes/link/RouteListItem';
import { SearchBar } from '../search/SearchBar';

export function Home() {
  const api = useApi();
  const routes = api?.routes ?? [];

  return (
    <section class="bg-center bg-no-repeat py-4 bg-gray-800 md:w-80">
      <IconButton class="w-12 h-12 p-3 text-white" dark>
        <MenuIcon />
      </IconButton>
      <h2 class="font-display font-medium text-xl text-center text-white">
        Aloha kakahiaka
      </h2>
      <SearchBar />
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
    </section>
  );
}
