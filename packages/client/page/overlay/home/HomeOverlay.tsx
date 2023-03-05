import { useCallback, useRef, useState } from 'preact/hooks';
import { MenuIcon } from '../../../assets/icons/MenuIcon';
import { Logo } from '../../../components/Logo';
import { useLazyComponent, useToggle } from '../../hooks';
import { BaseOverlay } from '../BaseOverlay';
import { DirectionsSearch } from '../search/directions/DirectionsSearch';
import { SimpleSearch } from '../search/simple/SimpleSearch';
import { Home } from './Home';

const lazyMenu = import('./menu/Menu');

export function HomeOverlay() {
  const [menuOpen, { toggle: toggleMenu, setFalse: closeMenu }] = useToggle();
  const [screen, setScreen] = useState<'home' | 'search' | 'directions'>(
    'home',
  );
  const { Menu } = useLazyComponent(() => lazyMenu);

  const iconRef = useRef<HTMLButtonElement>(null);
  const dismissMenu = useCallback(() => {
    iconRef.current?.focus();
    closeMenu();
  }, [closeMenu]);

  switch (screen) {
    case 'home':
      return (
        <BaseOverlay
          logo={
            <a href="/">
              <Logo />
            </a>
          }
          navigation={{
            icon: <MenuIcon open={menuOpen} />,
            'aria-expanded': menuOpen,
            onClick: toggleMenu,
            ref: iconRef,
          }}
        >
          {menuOpen && Menu ? (
            <Menu labelledBy="appBarUp" onDismiss={dismissMenu} />
          ) : undefined}
          <Home onSearch={() => setScreen('search')} />
        </BaseOverlay>
      );
    case 'search':
      return (
        <BaseOverlay title="Search" onNavigate={() => setScreen('home')}>
          <SimpleSearch onDirections={() => setScreen('directions')} />
        </BaseOverlay>
      );
    case 'directions':
      return (
        <BaseOverlay title="Directions" onNavigate={() => setScreen('home')}>
          <DirectionsSearch onClose={() => setScreen('home')} />
        </BaseOverlay>
      );
  }
}
