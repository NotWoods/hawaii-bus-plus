import { Point } from '@hawaii-bus-plus/presentation';
import { nowWithZone } from '@hawaii-bus-plus/utils';
import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import type { Journey } from '../../../worker-nearby/directions/format';
import type { NearbyWorkerHandler } from '../../../worker-nearby/nearby';
import DirectionsWorker from '../../../worker-nearby/nearby?worker';
import { databaseInitialized } from '../../hooks/useDatabaseInitialized';
import { usePromise } from '../../hooks/usePromise';
import { useWorker } from '../../hooks/useWorker';
import { CloseButton } from '../../page-wrapper/alert/CloseButton';
import { SidebarContainer } from '../../page-wrapper/Containers';
import { emptyResults } from '../search/places-autocomplete';
import '../Sidebar.css';
import { DirectionsField } from './DirectionsField';
import { DirectionsJourneys } from './DirectionsJourneys';
import { DirectionsPointResults } from './DirectionsPointResults';
import { DirectionsTime } from './DirectionsTime';

interface Props {
  onClose?(): void;
}

export function DirectionsSidebar(props: Props) {
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
    <SidebarContainer>
      <form className="bg-white bg-dark-dm">
        <div className="sidebar-content directions-box">
          <div className="d-flex justify-content-end">
            <CloseButton
              className="ml-auto text-reset"
              onClick={props.onClose}
            />
          </div>
          <DirectionsField
            id="directionsDepart"
            label="Departing"
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
        </div>
        <DirectionsTime
          now={now}
          value={departureTime}
          onChange={setDepartTime}
        />
      </form>

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
    </SidebarContainer>
  );
}
