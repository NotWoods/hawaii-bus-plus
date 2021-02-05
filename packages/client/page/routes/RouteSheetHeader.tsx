import { ComponentChildren, h } from 'preact';
import { useContext } from 'preact/hooks';
import { CloseButton } from '../page-wrapper/alert/CloseButton';
import { closeRouteAction } from '../router/action';
import { RouterContext } from '../router/Router';

export function RouteSheetHeader(props: { children: ComponentChildren }) {
  const { dispatch } = useContext(RouterContext);

  return (
    <div className="route-sheet__name px-card py-15 d-flex border-bottom rounded-top dark-mode">
      <h2 className="m-0 font-weight-medium">{props.children}</h2>
      <CloseButton
        className="ml-auto"
        onClick={() => dispatch(closeRouteAction())}
      />
    </div>
  );
}
