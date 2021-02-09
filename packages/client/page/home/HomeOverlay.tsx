import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { Home } from './Home';
import { DirectionsSearch } from '../search/directions/DirectionsSearch';
import { SimpleSearch } from '../search/simple/SimpleSearch';

export function HomeOverlay() {
  const [screen, setScreen] = useState<'home' | 'search' | 'directions'>(
    'home'
  );

  return (
    <>
      {screen === 'home' ? <Home onSearch={() => setScreen('search')} /> : null}
      {screen === 'search' ? (
        <SimpleSearch
          onClose={() => setScreen('home')}
          onDirections={() => setScreen('directions')}
        />
      ) : null}
      {screen === 'directions' ? (
        <DirectionsSearch onClose={() => setScreen('home')} />
      ) : null}
    </>
  );
}
