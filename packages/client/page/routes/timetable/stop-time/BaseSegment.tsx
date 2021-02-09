import { PlainTimeData } from '@hawaii-bus-plus/presentation';
import { h, Fragment } from 'preact';
import { classNames } from '../../../hooks/classnames';
import { Link } from '../../../router/Router';
import { PlainTimeElement } from '../../../time/PlainTimeElement';
import { TripDecorDot, TripDecorLine } from './DecorLines';

const gridTemplate = `
  'line-top .      .'    var(--segment-padding, 1rem)
  'line-top name   time' 0.5rem
  'dot      name   time' min-content
  'line     name   time' auto
  'line     desc   .'    auto
  'line     .      .'    var(--segment-padding, 1rem)
  / 0.5rem auto min-content
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
  small?: boolean;
}

function BaseSegmentContent({ name, desc, time, small }: ContentProps) {
  return (
    <>
      <TripDecorLine gridArea="line-top" />
      <TripDecorDot />
      <TripDecorLine gridArea="line" />
      <p class={small ? 'text-sm' : undefined} style={{ gridArea: 'name' }}>
        {name}
      </p>
      {desc && ' '}
      {desc && (
        <p class="text-sm" style={{ gridArea: 'desc' }}>
          {desc}
        </p>
      )}
      {time && (
        <PlainTimeElement
          time={time.arrivalTime}
          approximate={!time.timepoint}
          agencyTimezone={time.timeZone}
          class="whitespace-nowrap text-right"
          style={{ gridArea: 'time' }}
        />
      )}
    </>
  );
}

interface Props extends ContentProps {
  href?: string;
  class?: string;
  gridArea?: string;
}

export function BaseSegment(props: Props) {
  const { gridArea } = props;
  const linkClasses = classNames('grid gap-x-4', props.class);
  const style = { gridTemplate, gridArea };

  if (props.href) {
    return (
      <Link href={props.href} class={linkClasses} style={style}>
        <BaseSegmentContent {...props} />
      </Link>
    );
  } else {
    return (
      <div class={linkClasses} style={style}>
        <BaseSegmentContent {...props} />
      </div>
    );
  }
}
