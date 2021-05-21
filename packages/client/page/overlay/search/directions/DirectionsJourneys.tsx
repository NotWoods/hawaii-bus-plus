import { Point } from '@hawaii-bus-plus/presentation';
import clsx from 'clsx';
import { h } from 'preact';
import type { Journey } from '../../../../worker-directions/worker-directions';
import { SearchResultsSubList } from '../items/SearchResultsSubList';
import { DirectionsJourneyItem } from './DirectionsJourneyItem';

interface Props {
  results: readonly Journey[];
  depart: Point;
  arrive: Point;
  departureTime: string;
  onTomorrowClick?(): void;
  onClose?(): void;
}

const sharedClasses = 'fixed bottom-0 md:static';

export function DirectionsJourneys(props: Props) {
  const { results, departureTime } = props;

  if (results.length === 0) {
    return (
      <div class={clsx(sharedClasses, 'mx-4 mb-2 inset-x-0')}>
        <button
          class="block group m-auto px-8 py-4 shadow-xl text-black dark:text-white bg-primary-200 dark:bg-primary-700"
          onClick={props.onTomorrowClick}
        >
          <p>No results found.</p>
          <p class="group-hover:underline">
            Try searching for trips starting tomorrow?
          </p>
        </button>
      </div>
    );
  } else {
    const departureTimeString = departureTime.toString();
    return (
      <div
        class={clsx(
          sharedClasses,
          'overflow-x-auto snap snap-px-32 overscroll-contain',
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
              departureTime={departureTimeString}
              onClick={props.onClose}
            />
          )}
        />
      </div>
    );
  }
}
