import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { logoutUser } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitLogout = async (): Promise<void> => {
    await dispatch(logoutUser()).unwrap();
    await navigate('/login', { replace: true });
  };

  const handleLogout = (): void => {
    submitLogout().catch((error: unknown) => {
      console.error('Ошибка выхода из аккаунта:', error);
    });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
