import { h } from 'preact';
import { useState } from 'preact/hooks';
import { DirectionsSearch } from '../search/directions/DirectionsSearch';
import { SearchBase } from '../search/SearchBase';
import { SimpleSearch } from '../search/simple/SimpleSearch';
import { Home, Title } from './Home';

export function HomeOverlay() {
  const [screen, setScreen] = useState<'home' | 'search' | 'directions'>(
    'home'
  );

  switch (screen) {
    case 'home':
      return (
        <SearchBase icon={false} logo={<Title />}>
          <Home onSearch={() => setScreen('search')} />
        </SearchBase>
      );
    case 'search':
      return (
        <SearchBase title="Search" onClose={() => setScreen('home')}>
          <SimpleSearch onDirections={() => setScreen('directions')} />
        </SearchBase>
      );
    case 'directions':
      return (
        <SearchBase title="Directions" onClose={() => setScreen('home')}>
          <DirectionsSearch onClose={() => setScreen('home')} />
        </SearchBase>
      );
  }
}
