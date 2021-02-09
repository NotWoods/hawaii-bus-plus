import { h } from 'preact';
import type { Journey } from '../../worker-nearby/directions/format';
import { TripSegment } from './TripSegment';
import { WalkSegment } from './WalkSegment';
import { isJourneyTripSegment } from './JourneySegment';

interface Props {
  journey: Journey;
  timeZone: string;
}

export function DirectionsSheet2(props: Props) {
  return (
    <div className="route-sheet pointer-events-auto mx-10 border border-bottom-0 rounded-top bg-white bg-dark-light-dm">
      <div className="route-sheet__name px-card py-15 d-flex border-bottom rounded-top dark-mode">
        <h2 className="m-0 font-size-24 font-weight-bold">Directions</h2>
        <button
          className="btn btn-square ml-auto text-reset"
          type="button"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
      <div className="row row-eq-spacing-lg">
        <div className="col-lg-8">
          <div className="content">
            {props.journey.trips.map((segment, i) => {
              if (isJourneyTripSegment(segment)) {
                return (
                  <TripSegment
                    key={`${segment.route.route_id}-${i}`}
                    segment={segment}
                  />
                );
              } else {
                return <WalkSegment key={`walk-${i}`} walk={segment} />;
              }
            })}
          </div>
        </div>
        <div className="col-lg-4">...</div>
      </div>
    </div>
  );
}
