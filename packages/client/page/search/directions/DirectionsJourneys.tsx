import { Point } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { Temporal } from 'proposal-temporal';
import type { Journey } from '../../../worker-nearby/directions/format';
import { classNames } from '../../hooks/classnames';
import { openJourney } from '../../router/action';
import { directionsToParams } from '../../router/url';
import { SearchResultsSubList } from '../items/SearchResultsSubList';
import { JourneyDirectionsResultItem } from './JourneyDirectionsResultItem';

interface ItemProps {
  journey: Journey;
  from: Point;
  to: Point;
  departureTime: Temporal.PlainDateTime;
  onClick?(): void;
}

export function DirectionsJourneyItem(props: ItemProps) {
  const { journey } = props;
  const params = directionsToParams({
    depart: props.from,
    arrive: props.to,
    departureTime: props.departureTime.toString(),
  });

  return (
    <li>
      <JourneyDirectionsResultItem
        action={openJourney(
          props.from,
          props.to,
          props.departureTime.toString(),
          props.journey
        )}
        href={`/directions?${params.toString()}`}
        journey={journey}
        onClick={props.onClick}
      />
    </li>
  );
}

interface Props {
  results: readonly Journey[];
  depart: Point;
  arrive: Point;
  departureTime: Temporal.PlainDateTime;
  setDepartTime(value: Temporal.PlainDateTime): void;
  onClose?(): void;
}

const sharedClasses = 'fixed bottom-0 md:static';

export function DirectionsJourneys(props: Props) {
  const { results, departureTime } = props;

  function moveToTomorrow() {
    const tomorrow = departureTime
      .add({ days: 1 })
      .with({ hour: 0, minute: 0, second: 0 });
    props.setDepartTime(tomorrow);
  }

  if (results.length === 0) {
    return (
      <div class={classNames(sharedClasses, 'mx-4 mb-2 inset-x-0')}>
        <button
          class="block group m-auto px-8 py-4 shadow-xl text-black dark:text-white bg-blue-200 dark:bg-blue-700"
          onClick={moveToTomorrow}
        >
          <p>No results found.</p>
          <p class="group-hover:underline">
            Try searching for trips starting tomorrow?
          </p>
        </button>
      </div>
    );
  } else {
    return (
      <div
        class={classNames(
          sharedClasses,
          'overflow-x-auto snap snap-both snap-mandatory snap-px-32 overscroll-contain'
        )}
      >
        <SearchResultsSubList
          forceTitles
          list={results}
          title="By bus"
          titleClass="hidden md:block"
          child={(journey) => (
            <DirectionsJourneyItem
              journey={journey}
              from={props.depart}
              to={props.arrive}
              departureTime={departureTime}
              onClick={props.onClose}
            />
          )}
        />
      </div>
    );
  }
}
