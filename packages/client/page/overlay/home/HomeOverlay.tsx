import { useState } from 'preact/hooks';
import { MenuIcon } from '../../../assets/icons/MenuIcon';
import { Logo } from '../../../components/Logo';
import { useLazyComponent, useToggle } from '../../hooks';
import { BaseOverlay } from '../BaseOverlay';
import { DirectionsSearch } from '../search/directions/DirectionsSearch';
import { SimpleSearch } from '../search/simple/SimpleSearch';
import { Home } from './Home';

const lazyMenu = import('./menu/Menu');

export function HomeOverlay() {
  const [menuOpen, toggleMenuOpen] = useToggle();
  const [screen, setScreen] = useState<'home' | 'search' | 'directions'>(
    'home',
  );
  const { Menu } = useLazyComponent(() => lazyMenu);

  switch (screen) {
    case 'home':
      return (
        <BaseOverlay
          icon={<MenuIcon open={menuOpen} />}
          logo={
            <a href="/">
              <Logo />
            </a>
          }
          onButtonClick={toggleMenuOpen}
        >
          {Menu ? <Menu open={menuOpen} labelledBy="appBarUp" /> : undefined}
          <Home onSearch={() => setScreen('search')} />
        </BaseOverlay>
      );
    case 'search':
      return (
        <BaseOverlay title="Search" onButtonClick={() => setScreen('home')}>
          <SimpleSearch onDirections={() => setScreen('directions')} />
        </BaseOverlay>
      );
    case 'directions':
      return (
        <BaseOverlay title="Directions" onButtonClick={() => setScreen('home')}>
          <DirectionsSearch onClose={() => setScreen('home')} />
        </BaseOverlay>
      );
  }
}
