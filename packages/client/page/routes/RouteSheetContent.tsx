import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { Temporal } from 'proposal-temporal';
import { RouteDetailContext } from './context';
import { RouteDetailsCard } from './RouteDetails';
import { TripDetails } from './trip/TripDetails';

interface Props {
  tripTime: Temporal.PlainDateTime;
  setTripTime(value: Temporal.PlainDateTime): void;
}

export function RouteSheetContent(props: Props) {
  const { details, directionId, switchDirection } = useContext(
    RouteDetailContext
  );

  return (
    <div className="row row-eq-spacing-lg">
      <div className="col-lg-8">
        <div className="content">
          {details && (
            <TripDetails
              details={details}
              directionId={directionId}
              tripTime={props.tripTime}
              switchDirection={switchDirection}
              onChangeTripTime={props.setTripTime}
            />
          )}
        </div>
      </div>
      <div className="col-lg-4">
        <RouteDetailsCard
          route={details?.route}
          agency={details?.agency}
          descParts={details?.descParts}
        />
      </div>
    </div>
  );
}
