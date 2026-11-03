import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { selectUser, selectIsAuthChecked } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

import type { ReactNode } from 'react';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactNode;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as { from?: { pathname: string } })?.from;
    return <Navigate to={from?.pathname ?? '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return (
      <Navigate to="/login" state={{ from: { pathname: location.pathname } }} replace />
    );
  }

  return <>{children}</>;
};
