import { StopTimeData } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { JourneyTripSegment } from '../../worker-nearby/directions/format';
import { classNames } from '../hooks/classnames';
import expandIcon from '../icons/expand_more.svg';
import { Icon } from '../icons/Icon';
import { colorVariables } from '../routes/props';
import { RouteName } from '../routes/RouteName';
import {
  StopTimeDecorLines,
  StopTimeSegment,
} from '../routes/trip/StopTimeSegment';
import './TripSegment.css';

interface Props {
  segment: JourneyTripSegment;
}

export function TripSegment(props: Props) {
  const { route, trip, agency } = props.segment;
  const [first, ...stopTimes] = props.segment.stopTimes;
  const last = stopTimes.pop()!;

  return (
    <div className="card m-0 p-15" style={colorVariables(route)}>
      <h3 className="content-title font-size-20 m-0">{RouteName(route)}</h3>
      <h4 className="content-title font-size-16 m-0">{trip.trip_short_name}</h4>
      <StopTimeSegment
        href={`?stop=${first.stop.stop_id}`}
        name={first.stop.stop_name}
        description={first.stop.stop_desc}
        time={{ ...first, timeZone: agency.agency_timezone }}
        first
      />
      {stopTimes.length > 0 ? <TripCollapse stopTimes={stopTimes} /> : null}
      <StopTimeSegment
        href={`?stop=${last.stop.stop_id}`}
        name={last.stop.stop_name}
        description={last.stop.stop_desc}
        time={{ ...last, timeZone: agency.agency_timezone }}
        last
      />
    </div>
  );
}

interface TripCollapseProps {
  stopTimes: readonly StopTimeData[];
}

function TripCollapse({ stopTimes }: TripCollapseProps) {
  const [open, setOpen] = useState(false);

  return (
    <details
      className="directions__collapse"
      open={open}
      onToggle={() => setOpen(!open)}
    >
      <summary className="stoptime stoptime--indented stoptime--small">
        <StopTimeDecorLines showDot={false} />
        <Icon
          className={classNames('chevron', open && 'chevron--open')}
          src={expandIcon}
          alt={open ? 'Collapse' : 'Collapsed'}
        />
        <span className="stoptime-name">{stopTimes.length} stops</span>
      </summary>
      <ul className="m-0">
        {stopTimes.map((stopTime) => (
          <StopTimeSegment
            className="stoptime--indented"
            href={`?stop=${stopTime.stop.stop_id}`}
            name={stopTime.stop.stop_name}
            small
          />
        ))}
      </ul>
    </details>
  );
}
