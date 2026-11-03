import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect, useCallback } from 'react';

import {
  fetchFeeds,
  selectFeedOrders,
  selectFeedIsLoading,
  selectFeedError,
} from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedIsLoading);
  const error = useSelector(selectFeedError);

  useEffect(() => {
    void dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = useCallback((): void => {
    void dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className="text text_type_main-medium">
        {typeof error === 'string' ? error : 'Ошибка загрузки'}
      </p>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
