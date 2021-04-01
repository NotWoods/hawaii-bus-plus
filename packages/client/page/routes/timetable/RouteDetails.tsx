import { Agency, Route, Trip } from '@hawaii-bus-plus/types';
import { h } from 'preact';
import type { DescriptionPart } from '../../../worker-info/description';
import { DetailButtons } from './details/DetailButtons';
import { RouteDescription } from './details/RouteDescription';

interface Props {
  route?: Route;
  agency?: Agency;
  descParts?: readonly DescriptionPart[];
  tripId?: Trip['trip_id'];
}

export function RouteDetailsCard({ route, agency, descParts, tripId }: Props) {
  if (!route || !agency) {
    return null;
  }

  return (
    <footer class="bg-white dark:bg-gray-700 shadow-inner px-4 pt-6 pb-8 grid-area-footer">
      <div class="flex flex-wrap gap-1 justify-center mb-4">
        <DetailButtons route={route} agency={agency} tripId={tripId} />
      </div>
      <RouteDescription agency={agency} descParts={descParts} />
    </footer>
  );
}
