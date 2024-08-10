import type { ComponentChildren } from 'preact';
import { useErrorBoundary } from 'preact/hooks';
import { errorMessage } from '../hooks/usePromise';
import { useSnackbar } from '../snackbar/context';
import { Suspense } from 'preact/compat';

interface Props {
  children: ComponentChildren;
  fallback: ComponentChildren;
}

export function SnackbarErrorBoundary(props: Props) {
  const toastAlert = useSnackbar();
  const [error] = useErrorBoundary((error) => {
    toastAlert({
      children: errorMessage(error),
    });
  });

  if (error) {
    return <>{props.fallback}</>;
  } else {
    return <>{props.children}</>;
  }
}

export function SnackbarSuspense(props: Props) {
  return (
    <SnackbarErrorBoundary fallback={props.fallback}>
      <Suspense fallback={props.fallback}>{props.children}</Suspense>
    </SnackbarErrorBoundary>
  );
}
