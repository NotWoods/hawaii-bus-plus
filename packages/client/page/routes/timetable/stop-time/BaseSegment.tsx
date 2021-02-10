import { PlainTimeData } from '@hawaii-bus-plus/presentation';
import { h, Fragment } from 'preact';
import { classNames } from '../../../hooks/classnames';
import { Link } from '../../../router/Router';
import { PlainTimeElement } from '../../../time/PlainTimeElement';
import { TripDecorDot, TripDecorLine } from './DecorLines';
import './BaseSegment.css';

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

function BaseSegmentContent(props: ContentProps) {
  const { name, desc, time } = props;
  return (
    <>
      <TripDecorLine gridArea="line-top" />
      <TripDecorDot />
      <TripDecorLine gridArea="line" />
      <p
        class={classNames('group-hover:underline', props.small && 'text-sm')}
        style={{ gridArea: 'name' }}
      >
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
  const linkClasses = classNames('segment grid gap-x-4', props.class);
  const style = { gridArea };

  if (props.href) {
    return (
      <Link
        href={props.href}
        class={classNames(linkClasses, 'group')}
        style={style}
      >
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
