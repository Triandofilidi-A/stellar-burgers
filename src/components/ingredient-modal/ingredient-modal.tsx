import { Modal, IngredientDetails } from '@components';
import { useNavigate, useLocation, type Location } from 'react-router-dom';

export const IngredientModal = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = (): void => {
    const background = (location.state as { background?: Location })?.background;
    void navigate(background ?? '/', { replace: true });
  };

  return (
    <Modal title="Детали ингредиента" onClose={handleClose}>
      <IngredientDetails />
    </Modal>
  );
};
