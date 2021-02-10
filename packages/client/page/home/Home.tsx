import { Agency } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { useApi } from '../hooks/useApi';
import { MenuIcon } from '../icons/MenuIcon';
import { SearchBar } from '../search/SearchBar';
import { SearchBase } from '../search/SearchBase';
import { NearbyRoutes } from '../stop/NearbyRoutes';

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
      <NearbyRoutes
        class="mt-12 overflow-auto"
        routes={routes}
        agencies={
          api
            ? new Map(
                Object.entries(api.agency) as [Agency['agency_id'], Agency][]
              )
            : new Map()
        }
      />
    </SearchBase>
  );
}
