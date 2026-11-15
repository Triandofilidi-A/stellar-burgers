import { AppHeader, ProtectedRoute } from '@components';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, useLocation, type Location } from 'react-router-dom';

import { IngredientModal } from '@components/ingredient-modal';
import { OrderModal } from '@components/order-modal';
import { ConstructorPage } from '@pages/constructor-page';
import { Feed } from '@pages/feed';
import { ForgotPassword } from '@pages/forgot-password';
import { IngredientDetailsPage } from '@pages/ingredient-details-page';
import { Login } from '@pages/login';
import { NotFound404 } from '@pages/not-fount-404';
import { OrderDetailsPage } from '@pages/order-details-page';
import { Profile } from '@pages/profile';
import { ProfileOrders } from '@pages/profile-orders';
import { Register } from '@pages/register';
import { ResetPassword } from '@pages/reset-password';

import {
  fetchIngredients,
  selectIngredients,
  selectIsIngredientsLoading,
  selectIngredientsError,
} from '../../services/slices/ingredientsSlice';
import { checkUserAuth, selectIsAuthChecked } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { AppContentProps } from './type';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const location = useLocation();
  const background = (location.state as { background?: Location })?.background;
  const dispatch = useDispatch();
  const isAuthChecked = useSelector(selectIsAuthChecked);

  useEffect(() => {
    void dispatch(checkUserAuth());
    void dispatch(fetchIngredients());
  }, [dispatch]);

  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIsIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  if (!isAuthChecked || isIngredientsLoading) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <Preloader />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError ? { message: ingredientsError } : null}
        background={background ?? null}
      />
    </div>
  );
};

type ExtendedAppContentProps = AppContentProps & {
  background: Location | null;
};

const AppContent = ({
  ingredients,
  isLoading,
  error,
  background,
}: ExtendedAppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients?.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:number" element={<OrderDetailsPage />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/ingredients/:id" element={<IngredientDetailsPage />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route path="/feed/:number" element={<OrderModal />} />
          <Route path="/ingredients/:id" element={<IngredientModal />} />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <OrderModal />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default App;
