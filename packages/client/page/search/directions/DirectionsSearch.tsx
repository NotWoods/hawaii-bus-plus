import { Point } from '@hawaii-bus-plus/presentation';
import { nowWithZone } from '@hawaii-bus-plus/utils';
import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import type { Journey } from '../../../worker-nearby/directions/format';
import type { NearbyWorkerHandler } from '../../../worker-nearby/nearby';
import DirectionsWorker from '../../../worker-nearby/nearby?worker';
import { DirectionsTime } from '../../directions/DirectionsTime';
import { databaseInitialized } from '../../hooks/useDatabaseInitialized';
import { usePromise } from '../../hooks/usePromise';
import { useWorker } from '../../hooks/useWorker';
import { SearchBase } from '../SearchBase';
import { emptyResults } from '../simple/places-autocomplete';
import { DirectionsField } from './DirectionsField';
import { DirectionsJourneys } from './DirectionsJourneys';
import { DirectionsPointResults } from './DirectionsPointResults';

interface Props {
  onClose?(): void;
}

export function DirectionsSearch(props: Props) {
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

  // TODO overlay results on top of map
  return (
    <SearchBase title="Directions" onClose={props.onClose}>
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
      <DirectionsTime
        now={now}
        value={departureTime}
        onChange={setDepartTime}
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
