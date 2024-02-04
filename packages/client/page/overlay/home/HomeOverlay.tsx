import { useState } from 'preact/hooks';
import { Logo } from '../../../components/Logo';
import { BaseOverlay } from '../BaseOverlay';
import { DirectionsSearch } from '../search/directions/DirectionsSearch';
import { SimpleSearch } from '../search/simple/SimpleSearch';
import { Home } from './Home';

export function HomeOverlay() {
  const [screen, setScreen] = useState<'home' | 'search' | 'directions'>(
    'home',
  );

  switch (screen) {
    case 'home':
      return (
        <BaseOverlay
          logo={
            <a href="/">
              <Logo />
            </a>
          }
        >
          <Home onSearch={() => setScreen('search')} />
        </BaseOverlay>
      );
    case 'search':
      return (
        <BaseOverlay title="Search" onNavigate={() => setScreen('home')}>
          <SimpleSearch
            autoFocus
            onDirections={() => setScreen('directions')}
          />
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
