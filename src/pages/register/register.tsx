import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { registerUser } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitRegistration = async (): Promise<void> => {
    await dispatch(registerUser({ name: userName, email, password })).unwrap();

    await navigate('/', { replace: true });
  };

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    setError(null);

    submitRegistration().catch((error: unknown) => {
      setError(typeof error === 'string' ? error : 'Ошибка регистрации');
    });
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
