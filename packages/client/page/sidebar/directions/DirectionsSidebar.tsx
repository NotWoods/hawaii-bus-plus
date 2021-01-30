import { Point } from '@hawaii-bus-plus/presentation';
import { Temporal } from 'proposal-temporal';
import React, { useState } from 'react';
import type { NearbyWorkerHandler } from '../../../worker-nearby/nearby';
import type { Journey } from '../../../worker-nearby/directions/format';
import DirectionsWorker from '../../../worker-nearby/nearby?worker';
import { databaseInitialized } from '../../hooks/useDatabaseInitialized';
import { usePromise } from '../../hooks/usePromise';
import { useWorker } from '../../hooks/useWorker';
import { SidebarContainer } from '../../page-wrapper/Containers';
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
  const [results, setResults] = useState<Journey[]>([]);

  const postToDirectionsWorker = useWorker(
    DirectionsWorker
  ) as NearbyWorkerHandler;

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
            <button
              className="btn btn-square ml-auto text-reset"
              type="button"
              onClick={props.onClose}
            >
              &times;
            </button>
          </div>
          <DirectionsField
            id="directionsDepart"
            label="Departing"
            onChange={setDepart}
          />
          <DirectionsField
            id="directionsArrive"
            label="Arriving at"
            onChange={setArrive}
          />
        </div>
        <DirectionsTime onChange={setDepartTime} />
      </form>

      {results.map((journey) => (
        <p>{JSON.stringify(journey, undefined, 2)}</p>
      ))}
    </SidebarContainer>
  );
}
