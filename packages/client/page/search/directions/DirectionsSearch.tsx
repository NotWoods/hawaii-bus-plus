import { Point } from '@hawaii-bus-plus/presentation';
import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import type { Temporal } from 'proposal-temporal';
import type {
  DirectionsResult,
  NearbyWorkerHandler,
} from '../../../worker-nearby/nearby';
import DirectionsWorker from '../../../worker-nearby/nearby?worker';
import { LoadingBar } from '../../buttons/LoadingBar';
import { DirectionsTime } from '../../directions/DirectionsTime';
import { useDelay, useLazyComponent, usePromise, useWorker } from '../../hooks';
import { dbInitialized } from '../../hooks/api';
import { NOW, timeForWorker } from '../../time/input/symbol';
import { emptyResults } from '../simple/places-autocomplete';
import { lazySearchResults } from '../simple/SimpleSearch';
import { DirectionsField } from './DirectionsField';

interface Props {
  onClose?(): void;
}

export function DirectionsSearch(_props: Props) {
  const [depart, setDepart] = useState<Point | undefined>();
  const [arrive, setArrive] = useState<Point | undefined>();
  const [departureTime, setDepartTime] = useState<
    Temporal.PlainDateTime | string | NOW | undefined
  >();

  const [searchResults, setSearchResults] = useState({
    field: 'depart' as 'depart' | 'arrive',
    results: emptyResults,
  });
  const [results, setResults] = useState<DirectionsResult | undefined>();
  const { DirectionsPointResults, DirectionsJourneys } = useLazyComponent(
    lazySearchResults,
  );

  const postToDirectionsWorker = useWorker(
    DirectionsWorker,
  ) as NearbyWorkerHandler;
  const delayDone = useDelay(300, [depart, arrive, departureTime]);

  usePromise(
    async (signal) => {
      if (!depart || !arrive) {
        setResults(undefined);
        return;
      }

      await dbInitialized;
      const results = await postToDirectionsWorker(signal, {
        type: 'directions',
        from: depart,
        to: arrive,
        departureTime: timeForWorker(departureTime),
      });

      setResults(results);
    },
    [depart, arrive, departureTime],
  );

  function renderJourneys() {
    if (depart && arrive) {
      if (results && DirectionsJourneys) {
        return (
          <DirectionsJourneys
            results={results.journeys}
            depart={depart}
            arrive={arrive}
            departureTime={results.depatureTime}
            onTomorrowClick={() => setDepartTime(results.tomorrow)}
          />
        );
      } else if (delayDone) {
        return <LoadingBar />;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  return (
    <>
      <DirectionsField
        id="directionsDepart"
        label="Departing from"
        point={depart}
        onChange={setDepart}
        onSearchResults={(results) =>
          setSearchResults({
            field: 'depart',
            results,
          })
        }
      />
      <DirectionsField
        id="directionsArrive"
        label="Arriving at"
        point={arrive}
        onChange={setArrive}
        onSearchResults={(results) =>
          setSearchResults({
            field: 'arrive',
            results,
          })
        }
      />
      <DirectionsTime value={departureTime} onChange={setDepartTime} />

      {DirectionsPointResults ? (
        <DirectionsPointResults
          {...searchResults}
          setResults={setSearchResults}
          setDepart={setDepart}
          setArrive={setArrive}
        />
      ) : null}

      {renderJourneys()}
    </>
  );
}
