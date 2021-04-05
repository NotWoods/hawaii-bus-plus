import { StopTimeData } from '@hawaii-bus-plus/presentation';
import { Stop } from '@hawaii-bus-plus/types';
import { Fragment, h } from 'preact';
import expandIcon from '../../../icons/expand_more.svg';
import { Icon } from '../../../icons/Icon';
import { BaseSegment } from './BaseSegment';
import { stopLink, StopTimeSegment } from './StopTimeSegment';
import { stopTimeKeys } from './StopTimeSegmentList';
import './TripCollapse.css';

interface Props {
  stopTimes: readonly Pick<
    StopTimeData,
    'stop' | 'arrivalTime' | 'departureTime' | 'timepoint'
  >[];
  open?: boolean;
  timeZone: string;
  onToggle?(): void;
  link?(stop: Stop): string;
}

export function StopTimesCollapsible(props: Props) {
  const { open, timeZone, link, onToggle } = props;
  const [first, ...stopTimes] = props.stopTimes;
  const last = stopTimes.pop()!;

  return (
    <>
      <StopTimeSegment stopTime={first} timeZone={timeZone} link={link} />
      {stopTimes.length > 0 ? (
        <TripCollapse
          stopTimes={stopTimes}
          open={open}
          link={link}
          onToggle={onToggle}
        />
      ) : null}
      <StopTimeSegment stopTime={last} timeZone={timeZone} link={link} />
    </>
  );
}

function toggleAlt(open: boolean | undefined) {
  if (open == undefined) {
    return '';
  } else if (open) {
    return 'Collapse';
  } else {
    return 'Collapsed';
  }
}

function TripCollapse({
  stopTimes,
  open,
  link = stopLink,
  onToggle,
}: Omit<Props, 'timeZone'>) {
  const makeKey = stopTimeKeys();

  return (
    <details class="trip-collapse" open={open} onToggle={onToggle}>
      <summary class="flex -mx-2 overflow-hidden">
        <Icon
          class="trip-collapse__icon transform transition-transform filter dark:invert"
          src={expandIcon}
          alt={toggleAlt(open)}
        />
        <p class="ml-2">{stopTimes.length} stops</p>
      </summary>
      {stopTimes.map((stopTime) => (
        <BaseSegment
          key={makeKey(stopTime.stop.stop_id)}
          href={link(stopTime.stop)}
          name={stopTime.stop.stop_name}
          small
        />
      ))}
    </details>
  );
}
