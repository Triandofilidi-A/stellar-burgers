import { IngredientsCategoryUI } from '@ui';
import { useMemo } from 'react';

import {
  selectConstructorBun,
  selectConstructorIngredients,
} from '../../services/slices/constructorSlice';
import { useSelector } from '../../services/store';

import type { TIngredientsCategoryProps } from './type';
import type { TConstructorIngredient } from '@utils-types';

export const IngredientsCategory = ({
  title,
  titleRef,
  ingredients,
  ref,
}: TIngredientsCategoryProps): React.JSX.Element => {
  const bun = useSelector(selectConstructorBun);
  const constructorIngredients = useSelector(selectConstructorIngredients);

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};

    if (constructorIngredients && Array.isArray(constructorIngredients)) {
      constructorIngredients.forEach((ingredient: TConstructorIngredient) => {
        if (!counters[ingredient._id]) counters[ingredient._id] = 0;
        counters[ingredient._id]++;
      });
    }

    if (bun) counters[bun._id] = 2;

    return counters;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
};
