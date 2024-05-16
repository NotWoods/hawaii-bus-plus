import type { PlainTimeData } from '@hawaii-bus-plus/presentation';
import clsx from 'clsx';

import { Link } from '../../../../router/Router';
import { PlainTimeElement } from '../../../../time/PlainTimeElement';
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
      <p class={clsx({ 'text-sm': props.small })} style={{ gridArea: 'name' }}>
        <span class="group-hover:underline">{name}</span>
        {desc && ' '}
        {desc && <span class="text-sm block lg:inline">{desc}</span>}
      </p>
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
