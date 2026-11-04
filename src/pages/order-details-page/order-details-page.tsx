import { OrderInfo } from '@components';

import styles from './order-details-page.module.css';

export const OrderDetailsPage = (): React.JSX.Element => {
  return (
    <main className={styles.container}>
      <OrderInfo />
    </main>
  );
};
