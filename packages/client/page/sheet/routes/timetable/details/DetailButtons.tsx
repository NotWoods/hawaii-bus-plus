import { Agency, Route, Trip } from '@hawaii-bus-plus/types';

import { useCallback } from 'preact/hooks';
import { DetailButtons as BareDetailButtons } from '../../../../../components/RouteDescription/DetailButtons';
import { buildShareHandler } from '../../../../../services/share/share-handler';
import { errorMessage } from '../../../../hooks';
import { useSnackbar } from '../../../../snackbar/context';

interface Props {
  route: Route;
  agency: Agency;
  tripId?: Trip['trip_id'];
}

function useShare(text: string) {
  const toastAlert = useSnackbar();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(
    buildShareHandler(text, (err) =>
      toastAlert({
        children: errorMessage(err),
      }),
    ),
    [text, toastAlert],
  );

  // @ts-expect-error Testing for Share API
  if (!import.meta.env.SSR && navigator.share) {
    return callback;
  } else {
    return undefined;
  }
}

export function DetailButtons(props: Props) {
  const handleShare = useShare(props.route.route_long_name);

  return <BareDetailButtons {...props} class="mb-4" onShare={handleShare} />;
}
