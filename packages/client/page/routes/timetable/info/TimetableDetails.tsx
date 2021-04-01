import { Agency } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import { useCallback, useRef } from 'preact/hooks';
import { DirectionDetails } from '../../../../worker-info/trip-details';
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

export function TimetableDetails(props: Props) {
  const { directionsDetails, agency } = props;
  const scrollEl = useRef<HTMLDivElement>();

  // Scroll to the current detail
  /*useEffect(() => {
    console.log(directionId);
    const container = scrollEl.current;
    container.scrollTo({
      left: container.clientWidth * directionId,
      behavior: 'smooth',
    });
  }, [directionId]);*/

  const handleScroll = useCallback(
    debounce(() => {
      const container = scrollEl.current;
      const newDirectionId = container.scrollLeft / container.clientWidth;
      console.log('Left position', container.scrollLeft, newDirectionId);
      if (newDirectionId !== directionId) {
        switchDirection!();
      }
    }, 300),
    [switchDirection]
  );

  return (
    <header class="relative">
      <div
        class="timetable__details grid scroll snap overflow-x-auto"
        style={{
          gridTemplateColumns: directionsDetails.map(() => '100%').join(' '),
        }}
        ref={scrollEl}
        onScroll={handleScroll}
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
