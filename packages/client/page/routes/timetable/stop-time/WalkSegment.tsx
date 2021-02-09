import { formatWalkingTime, Walking } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { BaseSegment } from './BaseSegment';

interface Props {
  walk: Walking;
}

export function WalkSegment(props: Props) {
  return <BaseSegment name={formatWalkingTime(props.walk)} />;
}
