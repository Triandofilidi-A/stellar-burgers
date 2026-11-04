import { Preloader } from '@ui';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { selectUser, selectIsAuthChecked } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

import type { ReactNode } from 'react';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactNode;
};

type RedirectLocation = {
  pathname: string;
  search: string;
  hash: string;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);

  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isAuthChecked) return;

    if (!onlyUnAuth && !user) {
      const from: RedirectLocation = {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      };
      localStorage.setItem('redirectAfterLogin', JSON.stringify(from));
      void navigate('/login', { replace: true });
      return;
    }

    if (onlyUnAuth && user && !hasRedirected.current) {
      hasRedirected.current = true;

      const stateFrom = (location.state as { from?: RedirectLocation } | null)?.from;
      let from: RedirectLocation | undefined = stateFrom;

      if (!from) {
        const savedRedirect = localStorage.getItem('redirectAfterLogin');
        if (savedRedirect) {
          from = JSON.parse(savedRedirect) as RedirectLocation;
        }
      }

      const target: RedirectLocation = from ?? { pathname: '/', search: '', hash: '' };
      void navigate(target, { replace: true });
      return;
    }

    if (!onlyUnAuth && user) {
      localStorage.removeItem('redirectAfterLogin');
    }
  }, [isAuthChecked, onlyUnAuth, user, location, navigate]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    return <Preloader />;
  }

  return <>{children}</>;
};
