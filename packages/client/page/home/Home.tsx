import { h } from 'preact';
import { useApi } from '../hooks/useApi';
import { IconTw } from '../icons/Icon';
import { MenuIcon } from '../icons/MenuIcon';
import searchIcon from '../icons/search.svg';
import { RouteLinkVertical } from '../routes/link/RouteListItem';
import background from './guille-pozzi-g3esK1uXCjM-unsplash.jpg';

function SearchBar() {
  return (
    <form class="relative shadow-sm m-4">
      <input
        type="search"
        class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300"
      />
      <button
        type="submit"
        class="absolute inset-y-0 right-0 focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 px-2 border-transparent bg-transparent sm:text-sm"
      >
        <IconTw src={searchIcon} alt="Search" />
      </button>
    </form>
  );
}

export function Home() {
  const api = useApi();
  const routes = api?.routes ?? [];

  return (
    <section
      style={{ backgroundImage: `url('${background}')` }}
      class="bg-center bg-no-repeat py-4"
    >
      <button type="button" class="w-12 h-12 p-3 text-white">
        <MenuIcon />
      </button>
      <h2 class="font-display font-medium text-xl text-center text-white">
        Aloha kakahiaka
      </h2>
      <SearchBar />
      <ul
        class="mt-12 grid grid-flow-col gap-4 overflow-x-auto px-4 scroll-snap-x scroll-pl-8 overscroll-contain"
        style="scroll-padding-inline-start: 2rem; scroll-snap-type: x mandatory"
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
