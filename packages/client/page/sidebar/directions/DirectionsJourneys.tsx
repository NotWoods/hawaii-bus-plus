import { Point } from '@hawaii-bus-plus/presentation';
import { h, Fragment } from 'preact';
import { Temporal } from 'proposal-temporal';
import type { Journey } from '../../../worker-nearby/directions/format';
import { SidebarTitle } from '../SidebarTitle';
import { DirectionsJourneyResults } from './DirectionsJourneyResult';

interface Props {
  results: readonly Journey[];
  depart: Point;
  arrive: Point;
  departureTime: Temporal.PlainDateTime;
  setDepartTime(value: Temporal.PlainDateTime): void;
  onClose?(): void;
}

export function DirectionsJourneys(props: Props) {
  const { results, departureTime } = props;

  function moveToTomorrow() {
    const tomorrow = departureTime
      .add({ days: 1 })
      .with({ hour: 0, minute: 0, second: 0 });
    props.setDepartTime(tomorrow);
  }

  return (
    <>
      <SidebarTitle>By bus</SidebarTitle>
      {results.length === 0 ? (
        <button class="sidebar-link" onClick={moveToTomorrow}>
          No results found. Try searching for trips starting tomorrow?
        </button>
      ) : null}
      {results.map((journey) => (
        <DirectionsJourneyResults
          journey={journey}
          from={props.depart}
          to={props.arrive}
          departureTime={departureTime}
          onClick={props.onClose}
        />
      ))}
    </>
  );
}
