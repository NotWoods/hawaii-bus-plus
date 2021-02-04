import { Point } from '@hawaii-bus-plus/presentation';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Temporal } from 'proposal-temporal';
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
import { DirectionsJourneyResults } from './DirectionsJourneyResult';
import { DirectionsPointResults } from './DirectionsPointResults';
import { DirectionsTime } from './DirectionsTime';

interface Props {
  onClose?(): void;
}

export function DirectionsSidebar(props: Props) {
  const [depart, setDepart] = useState<Point | undefined>();
  const [arrive, setArrive] = useState<Point | undefined>();
  const [departureTime, setDepartTime] = useState(
    Temporal.now.plainDateTimeISO()
  );

  const [searchResults, setSearchResults] = useState({
    field: 'depart' as 'depart' | 'arrive',
    results: emptyResults,
  });
  const [results, setResults] = useState<Journey[]>([]);

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
        <DirectionsTime onChange={setDepartTime} />
      </form>

      <DirectionsPointResults
        {...searchResults}
        setResults={setSearchResults}
        setDepart={setDepart}
        setArrive={setArrive}
      />
      {results.map((journey) => (
        <DirectionsJourneyResults
          journey={journey}
          from={depart!}
          to={arrive!}
          departureTime={departureTime}
          onClick={props.onClose}
        />
      ))}
    </SidebarContainer>
  );
}
