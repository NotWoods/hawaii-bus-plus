import { Point } from '@hawaii-bus-plus/presentation';
import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import type { Temporal } from 'proposal-temporal';
import type {
  DirectionsResult,
  NearbyWorkerHandler,
} from '../../../worker-nearby/nearby';
import DirectionsWorker from '../../../worker-nearby/nearby?worker';
import { useApiKey } from '../../api/hook';
import { DirectionsTime } from '../../directions/DirectionsTime';
import { useLazyComponent } from '../../hooks/useLazyComponent';
import { usePromise } from '../../hooks/usePromise';
import { useWorker } from '../../hooks/useWorker';
import { NOW } from '../../time/input/symbol';
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
    lazySearchResults
  );

  const apiKey = useApiKey();
  const postToDirectionsWorker = useWorker(
    DirectionsWorker
  ) as NearbyWorkerHandler;

  usePromise(
    async (signal) => {
      if (!apiKey || !depart || !arrive) return;

      const results = await postToDirectionsWorker(signal, {
        type: 'directions',
        apiKey,
        from: depart,
        to: arrive,
        departureTime:
          typeof departureTime === 'string'
            ? departureTime
            : typeof departureTime === 'object'
            ? departureTime.toString()
            : undefined,
      });

      setResults(results);
    },
    [apiKey, depart, arrive, departureTime]
  );

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

      {results && DirectionsJourneys ? (
        <DirectionsJourneys
          results={results.journeys}
          depart={depart!}
          arrive={arrive!}
          departureTime={results.depatureTime}
          onTomorrowClick={() => setDepartTime(results.tomorrow)}
        />
      ) : null}
    </>
  );
}
