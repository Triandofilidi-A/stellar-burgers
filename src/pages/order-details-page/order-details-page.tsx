import { OrderInfo } from '@components';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { fetchOrderByNumber, selectFeedOrders } from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

import styles from './order-details-page.module.css';

export const OrderDetailsPage = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);

  useEffect(() => {
    if (number && !orders.find((order) => order.number === Number(number))) {
      void dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orders]);

  return (
    <main className={styles.container}>
      <OrderInfo />
    </main>
  );
};
