import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Title } from '../../all-pages/Title';
import { useLazyComponent } from '../hooks';
import { MenuIcon } from '../icons/MenuIcon';
import { DirectionsSearch } from '../search/directions/DirectionsSearch';
import { SearchBase } from '../search/SearchBase';
import { SimpleSearch } from '../search/simple/SimpleSearch';
import { Home } from './Home';

const lazyMenu = import('./menu/Menu');

export function HomeOverlay() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [screen, setScreen] = useState<'home' | 'search' | 'directions'>(
    'home'
  );
  const { Menu } = useLazyComponent(() => lazyMenu);

  switch (screen) {
    case 'home':
      return (
        <SearchBase
          icon={<MenuIcon open={menuOpen} />}
          logo={<Title />}
          onButtonClick={() => setMenuOpen(!menuOpen)}
        >
          {Menu ? <Menu open={menuOpen} labelledBy="appBarUp" /> : undefined}
          <Home onSearch={() => setScreen('search')} />
        </SearchBase>
      );
    case 'search':
      return (
        <SearchBase title="Search" onButtonClick={() => setScreen('home')}>
          <SimpleSearch onDirections={() => setScreen('directions')} />
        </SearchBase>
      );
    case 'directions':
      return (
        <SearchBase title="Directions" onButtonClick={() => setScreen('home')}>
          <DirectionsSearch onClose={() => setScreen('home')} />
        </SearchBase>
      );
  }
}
