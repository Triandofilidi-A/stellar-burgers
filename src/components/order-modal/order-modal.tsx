import { Modal, OrderInfo } from '@components';
import { useNavigate, useLocation, type Location } from 'react-router-dom';

export const OrderModal = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = (): void => {
    const background: Location | undefined = (
      location.state as { background?: Location }
    )?.background;
    void navigate(background?.pathname ?? '/feed', { replace: true });
  };

  return (
    <Modal title="Детали заказа" onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};
