import { PlainTimeData } from '@hawaii-bus-plus/presentation';
import clsx, { ClassValue } from 'clsx';
import { Fragment, h } from 'preact';
import { Link } from '../../../router/Router';
import { PlainTimeElement } from '../../../time/PlainTimeElement';
import './BaseSegment.css';
import { TripDecorDot, TripDecorLine } from './DecorLines';

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
      <TripDecorDot />
      <TripDecorLine gridArea="line-top" />
      <TripDecorLine gridArea="line" />
      <p
        class={clsx('group-hover:underline', { 'text-sm': props.small })}
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
  class?: ClassValue;
  gridArea?: string;
}

export function BaseSegment(props: Props) {
  const { gridArea } = props;
  const linkClasses = clsx('segment grid gap-x-4', props.class);
  const style = { gridArea };

  if (props.href) {
    return (
      <Link href={props.href} class={clsx(linkClasses, 'group')} style={style}>
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
