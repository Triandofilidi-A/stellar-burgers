import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

import { loginUser } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    setError(null);

    dispatch(loginUser({ email, password }))
      .unwrap()
      .catch((err: Error) => {
        setError(err.message || 'Ошибка входа');
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
