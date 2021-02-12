import { Point } from '@hawaii-bus-plus/presentation';
import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import type { Temporal } from 'proposal-temporal';
import type { Journey } from '../../../worker-nearby/directions/format';
import type { NearbyWorkerHandler } from '../../../worker-nearby/nearby';
import DirectionsWorker from '../../../worker-nearby/nearby?worker';
import { DirectionsTime } from '../../directions/DirectionsTime';
import { databaseInitialized } from '../../hooks/useDatabaseInitialized';
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
    Temporal.PlainDateTime | NOW | undefined
  >();

  const [searchResults, setSearchResults] = useState({
    field: 'depart' as 'depart' | 'arrive',
    results: emptyResults,
  });
  const [results, setResults] = useState<readonly Journey[] | undefined>();
  const { DirectionsPointResults, DirectionsJourneys } = useLazyComponent(
    lazySearchResults
  );

  const postToDirectionsWorker = useWorker(
    DirectionsWorker
  ) as NearbyWorkerHandler;

  usePromise(
    async (signal) => {
      if (!depart || !arrive) return;

      await databaseInitialized;
      const results = await postToDirectionsWorker(signal, {
        type: 'directions',
        from: depart,
        to: arrive,
        departureTime: departureTime.toString(),
      });

      setResults(results);
    },
    [depart, arrive, departureTime]
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
          results={results}
          depart={depart!}
          arrive={arrive!}
          departureTime={departureTime}
          setDepartTime={setDepartTime}
        />
      ) : null}
    </>
  );
}
