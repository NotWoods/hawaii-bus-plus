import { h } from 'preact';
import { Sheet } from '../directions/JourneySheet';
import { MainMap } from '../map/MainMap';
import { Overlay } from './Overlay';

export function Main() {
  return (
    <main class="main ">
      <MainMap />
      <Overlay />
      <Sheet />
    </main>
  );
}
