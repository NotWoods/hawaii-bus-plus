import type { Agency } from '@hawaii-bus-plus/types';
import debounce from 'just-debounce';

import { useCallback, useEffect, useRef } from 'preact/hooks';
import type { DirectionDetails } from '@hawaii-bus-plus/workers/info';
import { setDirectionAction } from '../../../../router/action/routes';
import { useDispatch, useSelector } from '../../../../router/hooks';
import { selectLoadedDetails } from '../../../../router/selector/main';
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
    <div aria-hidden="true" class="inline-block invisible p-2 mt-2 ml-4">
      <div class="inline-block mr-2 w-6 h-6" />
      Switch direction
    </div>
  );
}

export function TimetableDetails(props: Props) {
  const { directionId } = useSelector(selectLoadedDetails);
  const dispatch = useDispatch();
  const { directionsDetails, agency } = props;
  const scrollEl = useRef<HTMLDivElement>(null);

  // Handle scroll events and update the direction ID when they happen
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = useCallback(
    debounce(() => {
      const scrollPos = scrollEl.current!.scrollLeft;
      const width = scrollEl.current!.offsetWidth;
      const newDirectionId = Math.round(scrollPos / width) as 0 | 1;

      dispatch(setDirectionAction(newDirectionId));
    }, 300),
    [dispatch],
  );

  // Set the scroll position when the direction ID shifts
  useEffect(() => {
    const width = scrollEl.current!.offsetWidth;
    scrollEl.current!.scrollTo({
      left: width * directionId,
      behavior: 'smooth',
    });
  }, [directionId]);

  return (
    <header class="relative">
      <div
        class="timetable__details grid scroll snap-both overflow-x-auto"
        style={{
          gridTemplateColumns: directionsDetails.map(() => '100%').join(' '),
        }}
        ref={scrollEl}
        onScroll={handleScroll}
      >
        {directionsDetails.map((directionDetails, id) => (
          <TimetableDirectionsDetail
            key={id}
            directionDetails={directionDetails}
            agency={agency}
            active={id === directionId}
          >
            <Spacer />
          </TimetableDirectionsDetail>
        ))}
      </div>
      <SwitchDirectionButton class="absolute bottom-0 right-4 m-4 bg-white dark:bg-zinc-700" />
    </header>
  );
}
