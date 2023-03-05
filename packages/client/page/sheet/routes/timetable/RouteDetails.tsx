import { Agency, Route, Trip } from '@hawaii-bus-plus/types';

import {
  DescriptionPart,
  RouteDescription,
} from '../../../../components/RouteDescription/RouteDescription';
import { DetailButtons } from './details/DetailButtons';

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
      <DetailButtons route={route} agency={agency} tripId={tripId} />
      <RouteDescription agency={agency} descParts={descParts} />
    </footer>
  );
}
