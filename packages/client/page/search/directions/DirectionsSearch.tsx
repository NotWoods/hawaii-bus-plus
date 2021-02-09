import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { emptyResults } from '../../sidebar/search/places-autocomplete';
import { SearchBase } from '../SearchBase';
import { DirectionsField } from './DirectionsField';
import { nowWithZone } from '@hawaii-bus-plus/utils';
import { Point } from '@hawaii-bus-plus/presentation';
import type { Journey } from '../../../worker-nearby/directions/format';
import DirectionsWorker from '../../../worker-nearby/nearby?worker';
import { useWorker } from '../../hooks/useWorker';
import type { NearbyWorkerHandler } from '../../../worker-nearby/nearby';
import { usePromise } from '../../hooks/usePromise';
import { databaseInitialized } from '../../hooks/useDatabaseInitialized';
import { DirectionsPointResults } from './DirectionsPointResults';
import { DirectionsJourneys } from './DirectionsJourneys';

export function DirectionsSearch() {
  const [depart, setDepart] = useState<Point | undefined>();
  const [arrive, setArrive] = useState<Point | undefined>();
  const now = useMemo(() => nowWithZone('Pacific/Honolulu'), []);
  const [departureTime, setDepartTime] = useState(now);

  const [searchResults, setSearchResults] = useState({
    field: 'depart' as 'depart' | 'arrive',
    results: emptyResults,
  });
  const [results, setResults] = useState<readonly Journey[] | undefined>();

  const postToDirectionsWorker = useWorker(
    DirectionsWorker
  ) as NearbyWorkerHandler;

  usePromise(async () => {
    if (!depart || !arrive) return;

    await databaseInitialized;
    const results = await postToDirectionsWorker({
      type: 'directions',
      from: depart,
      to: arrive,
      departureTime: departureTime.toString(),
    });

    setResults(results);
  }, [depart, arrive, departureTime]);

  return (
    <SearchBase>
      <h2 class="font-display font-medium text-2xl mx-4">Directions</h2>
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

      <DirectionsPointResults
        {...searchResults}
        setResults={setSearchResults}
        setDepart={setDepart}
        setArrive={setArrive}
      />

      {results ? (
        <DirectionsJourneys
          results={results}
          depart={depart!}
          arrive={arrive!}
          departureTime={departureTime}
          setDepartTime={setDepartTime}
        />
      ) : null}
    </SearchBase>
  );
}
