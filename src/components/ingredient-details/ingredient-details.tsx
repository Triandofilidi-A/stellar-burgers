import { Preloader, IngredientDetailsUI } from '@ui';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { useSelector } from '../../services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(selectIngredients);

  const ingredientData = useMemo(() => {
    return ingredients.find((item) => item._id === id) ?? null;
  }, [ingredients, id]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
