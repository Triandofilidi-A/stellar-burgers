import { describe, expect, test } from '@jest/globals';

import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';

import type { TIngredientsState } from '../ingredientsSlice';
import type { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 150,
  price: 100,
  image: 'test.png',
  image_large: 'test_large.png',
  image_mobile: 'test_mobile.png',
};

describe('Тесты редьюсера ingredientsSlice', () => {
  const initialState: TIngredientsState = {
    data: [],
    isLoading: false,
    error: null,
  };

  test('должен возвращать начальное состояние при передаче undefined и неизвестного экшена', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBeNull();
  });

  test('должен устанавливать isLoading в true и сбрасывать error при fetchIngredients.pending', () => {
    const result = ingredientsReducer(initialState, {
      type: fetchIngredients.pending.type,
    });
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  test('должен сохранять данные и устанавливать isLoading в false при fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: [mockIngredient],
    };
    const result = ingredientsReducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.data).toEqual([mockIngredient]);
    expect(result.error).toBeNull();
  });

  test('должен устанавливать error и isLoading в false при fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка сети' },
    };
    const result = ingredientsReducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка сети');
  });
});
