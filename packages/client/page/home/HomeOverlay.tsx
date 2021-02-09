import { h } from 'preact';
import { useState } from 'preact/hooks';
import { DirectionsSearch } from '../search/directions/DirectionsSearch';
import { SimpleSearch } from '../search/simple/SimpleSearch';
import { Home } from './Home';

export function HomeOverlay() {
  const [screen, setScreen] = useState<'home' | 'search' | 'directions'>(
    'home'
  );

  switch (screen) {
    case 'home':
      return <Home onSearch={() => setScreen('search')} />;
    case 'search':
      return (
        <SimpleSearch
          onClose={() => setScreen('home')}
          onDirections={() => setScreen('directions')}
        />
      );
    case 'directions':
      return <DirectionsSearch onClose={() => setScreen('home')} />;
  }
}
