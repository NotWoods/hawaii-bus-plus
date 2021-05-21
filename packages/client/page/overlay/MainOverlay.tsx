import { h } from 'preact';
import { useSelector } from '../router/hooks';
import { selectPointDetailsOpen } from '../router/selector/point';
import { PointDetails } from './stop/PointDetails';
import { HomeOverlay } from './home/HomeOverlay';

export function MainOverlay() {
  const openPoint = useSelector(selectPointDetailsOpen);

  if (openPoint) {
    return <PointDetails point={openPoint} />;
  } else {
    return <HomeOverlay />;
  }
}
