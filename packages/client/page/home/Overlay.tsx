import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { useState } from 'react';
import { RouterContext } from '../router/Router';
import { DirectionsSearch } from '../search/directions/DirectionsSearch';
import { SimpleSearch } from '../search/simple/SimpleSearch';
import { PointDetails } from '../stop/PointDetails';
import { Home } from './Home';

export function Overlay() {
  const { point } = useContext(RouterContext);
  const [screen, setScreen] = useState<'home' | 'search' | 'directions'>(
    'home'
  );

  switch (point?.type) {
    case 'stop':
    case 'place':
      return <PointDetails point={point} />;
    default:
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
}
