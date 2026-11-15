import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData,
  createOrder,
  resetConstructor,
} from '../../services/slices/constructorSlice';
import { selectUser, selectIsAuthChecked } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitOrder = async (): Promise<void> => {
    const result = await dispatch(createOrder());

    if (createOrder.rejected.match(result)) {
      console.error('Ошибка оформления заказа:', result.payload ?? result.error.message);
    }
  };

  const redirectToLogin = async (): Promise<void> => {
    await navigate('/login');
  };

  const onOrderClick = (): void => {
    if (!isAuthChecked) return;

    if (!user) {
      redirectToLogin().catch((error: unknown) => {
        console.error('Ошибка перехода на страницу входа:', error);
      });
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    submitOrder().catch((error: unknown) => {
      console.error('Необработанная ошибка оформления заказа:', error);
    });
  };

  const closeOrderModal = (): void => {
    dispatch(resetConstructor());
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsList = constructorItems.ingredients ?? [];
    const ingredientsPrice = ingredientsList.reduce(
      (s: number, v: TConstructorIngredient) => s + v.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
