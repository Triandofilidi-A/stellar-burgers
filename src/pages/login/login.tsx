import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { loginUser } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const submitLogin = async (): Promise<void> => {
    await dispatch(loginUser({ email, password })).unwrap();
    await navigate(from, { replace: true });
  };

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    setError(null);

    submitLogin().catch((error: unknown) => {
      setError(typeof error === 'string' ? error : 'Ошибка входа');
    });
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
