import { PlainTimeData } from '@hawaii-bus-plus/presentation';
import { h, Fragment } from 'preact';
import { classNames } from '../../../hooks/classnames';
import { Link } from '../../../router/Router';
import { ScheduleTime } from '../../trip/ScheduleTime';
import { TripDecorDot, TripDecorLine } from './DecorLines';

const gridTemplate = `
  'line-top .      .' 1rem
  'dot      name   time' auto
  'line     desc   .' auto
  'line     .      .' 1rem
  / 2rem auto min-content
`;

interface ContentProps {
  name: string;
  desc?: string;
  time?: {
    arrivalTime: PlainTimeData;
    departureTime: PlainTimeData;
    timeZone: string;
    timepoint: boolean;
  };
}

function BaseSegmentContent({ name, desc, time }: ContentProps) {
  return (
    <>
      <TripDecorLine gridArea="line-top" />
      <TripDecorDot />
      <TripDecorLine gridArea="line" />
      <p>{name}</p>
      {desc && ' '}
      {desc && <p class="text-sm">{desc}</p>}
      {time && (
        <ScheduleTime
          time={time.arrivalTime}
          approximate={!time.timepoint}
          agencyTimezone={time.timeZone}
          class="whitespace-nowrap text-right"
        />
      )}
    </>
  );
}

interface Props extends ContentProps {
  href?: string;
  class?: string;
}

export function BaseSegment(props: Props) {
  const linkClasses = classNames('grid', props.class);

  if (props.href) {
    return (
      <Link href={props.href} class={linkClasses} style={{ gridTemplate }}>
        <BaseSegmentContent {...props} />
      </Link>
    );
  } else {
    return (
      <div class={linkClasses} style={{ gridTemplate }}>
        <BaseSegmentContent {...props} />
      </div>
    );
  }
}
