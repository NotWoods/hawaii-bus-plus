import { Agency } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { useContext, useEffect, useRef } from 'preact/hooks';
import { useScroll, useVisibleElements } from 'react-snaplist-carousel';
import { DirectionDetails } from '../../../../worker-info/trip-details';
import { RouteDetailContext } from '../context';
import { SwitchDirectionButton } from './SwitchDirectionButton';
import './TimetableDetails.css';
import { TimetableDirectionsDetail } from './TimetableDirectionsDetail';

interface Props {
  directionsDetails: readonly DirectionDetails[];
  agency: Agency;
}

/** Spacer with the same size as SwitchDirectionButton */
function Spacer() {
  return (
    <div aria-hidden="true" class="inline-block invisible p-2 mt-4 ml-4">
      <div class="inline-block mr-2 w-6 h-6" />
      Switch direction
    </div>
  );
}

function first([element]: readonly number[]) {
  return element as 0 | 1;
}

export function TimetableDetails(props: Props) {
  const { directionId, setDirectionId } = useContext(RouteDetailContext);
  const { directionsDetails, agency } = props;
  const scrollEl = useRef<HTMLDivElement>();

  const visible = useVisibleElements({ debounce: 300, ref: scrollEl }, first);
  const goToChildren = useScroll({ ref: scrollEl });

  /*useEffect(() => {
    goToChildren(directionId);
  }, [goToChildren, directionId]);*/
  useEffect(() => {
    setDirectionId(visible);
  }, [visible, setDirectionId]);

  return (
    <header class="relative">
      <div
        class="timetable__details grid scroll snap overflow-x-auto"
        style={{
          gridTemplateColumns: directionsDetails.map(() => '100%').join(' '),
        }}
        ref={scrollEl}
      >
        {directionsDetails.map((directionDetails) => (
          <TimetableDirectionsDetail
            directionDetails={directionDetails}
            agency={agency}
          >
            <Spacer />
          </TimetableDirectionsDetail>
        ))}
      </div>
      <SwitchDirectionButton class="absolute bottom-0 right-0 m-4 bg-white dark:bg-gray-700" />
    </header>
  );
}
