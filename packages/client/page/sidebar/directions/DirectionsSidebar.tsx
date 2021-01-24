import { Temporal } from 'proposal-temporal';
import React, { useState } from 'react';
import type { Journey, Point } from '../../../worker-nearby/directions';
import DirectionsWorker from '../../../worker-nearby/nearby?worker';
import { usePromise } from '../../hooks/usePromise';
import { useWorker } from '../../hooks/useWorker';
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

  const worker = useWorker(DirectionsWorker);

  (window as any).debug = (depart: any, arrive: any) => {
    setDepart(depart);
    setArrive(arrive);
  };

  usePromise(
    async (signal) => {
      if (!depart || !arrive) return;

      const results = await worker?.postMessage({
        type: 'directions',
        from: depart,
        to: arrive,
        departureTime: departureTime.toString(),
      });

      if (results && !signal.aborted) {
        setResults(results as Journey[]);
      }
    },
    [depart, arrive, departureTime]
  );

  return (
    <aside className="sidebar">
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
    </aside>
  );
}
