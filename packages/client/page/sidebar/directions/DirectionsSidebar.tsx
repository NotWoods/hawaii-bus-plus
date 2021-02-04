import { Point } from '@hawaii-bus-plus/presentation';
import { useGoogleMap } from '@hawaii-bus-plus/react-google-maps';
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
import { buildPlacesService, getDetails } from '../../stop/PlaceCard';
import { emptyResults } from '../search/places-autocomplete';
import { SidebarSearchItems } from '../search/SidebarSearchItems';
import '../Sidebar.css';
import { DirectionsField } from './DirectionsField';
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

  const map = useGoogleMap();
  const placeService = map && buildPlacesService(map);

  const postToDirectionsWorker = useWorker(
    DirectionsWorker
  ) as NearbyWorkerHandler;

  const fieldSetters = {
    depart: setDepart,
    arrive: setArrive,
  };

  usePromise(
    async (signal) => {
      if (!depart || !arrive) return;

      await databaseInitialized;
      const results = await postToDirectionsWorker({
        type: 'directions',
        from: depart,
        to: arrive,
        departureTime: departureTime.toString(),
      });

      if (results && !signal.aborted) {
        setResults(results);
      }
    },
    [depart, arrive, departureTime]
  );

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

      <SidebarSearchItems
        forceTitles={false}
        favorites={searchResults.results.favorites}
        routes={[]}
        stops={searchResults.results.stops}
        places={searchResults.results.places}
        onStopClick={(stop) => {
          fieldSetters[searchResults.field]({
            type: 'stop',
            stopId: stop.stop_id,
            name: stop.stop_name,
          });
          setSearchResults({
            field: searchResults.field,
            results: emptyResults,
          });
        }}
        onPlaceClick={async (place) => {
          setSearchResults({
            field: searchResults.field,
            results: emptyResults,
          });

          const details = await getDetails(placeService!, {
            placeId: place.place_id,
            fields: ['geometry.location'],
          });
          fieldSetters[searchResults.field]({
            type: 'place',
            placeId: place.place_id,
            name: place.structured_formatting.main_text,
            position: details.geometry!.location.toJSON(),
          });
        }}
      />
      {results.map((journey) => (
        <p>{JSON.stringify(journey, undefined, 2)}</p>
      ))}
    </SidebarContainer>
  );
}
