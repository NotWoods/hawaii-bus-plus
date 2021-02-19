import { useAuth0 } from '@auth0/auth0-react';
import { h } from 'preact';
import { ButtonOrAnchor } from './ButtonOrAnchor';

export function LoginButton() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (isAuthenticated) {
    return null;
  } else {
    return <ButtonOrAnchor onClick={loginWithRedirect}>Log in</ButtonOrAnchor>;
  }
}
