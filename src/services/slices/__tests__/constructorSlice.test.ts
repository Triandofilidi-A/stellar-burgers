import { describe, expect, test } from '@jest/globals';

import {
  constructorReducer,
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  createOrder,
} from '../constructorSlice';

import type { TConstructorState } from '../constructorSlice';
import type { TConstructorIngredient, TOrder } from '@utils-types';

const mockBun: TConstructorIngredient = {
  _id: 'bun1',
  id: 'unique-bun-1',
  name: 'Флюоресцентная булка',
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

const mockIngredient1: TConstructorIngredient = {
  _id: 'ing1',
  id: 'unique-ing-1',
  name: 'Филе птицы',
  type: 'main',
  proteins: 20,
  fat: 10,
  carbohydrates: 5,
  calories: 200,
  price: 200,
  image: 'test.png',
  image_large: 'test_large.png',
  image_mobile: 'test_mobile.png',
};

const mockIngredient2: TConstructorIngredient = {
  _id: 'ing2',
  id: 'unique-ing-2',
  name: 'Соус',
  type: 'sauce',
  proteins: 2,
  fat: 1,
  carbohydrates: 5,
  calories: 50,
  price: 50,
  image: 'test.png',
  image_large: 'test_large.png',
  image_mobile: 'test_mobile.png',
};

describe('Тесты редьюсера constructorSlice', () => {
  const initialState: TConstructorState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null,
    orderError: null,
  };

  test('должен возвращать начальное состояние при передаче undefined и неизвестного экшена', () => {
    const result = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  test('должен добавлять булку и сбрасывать ошибку (addBun)', () => {
    const result = constructorReducer(initialState, addBun(mockBun));
    expect(result.bun).toEqual(
      expect.objectContaining({
        ...mockBun,
        id: expect.any(String),
      })
    );
    expect(result.orderError).toBeNull();
  });

  test('должен добавлять ингредиент в конец массива (addIngredient)', () => {
    let state = constructorReducer(initialState, addIngredient(mockIngredient1));
    state = constructorReducer(state, addIngredient(mockIngredient2));

    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]).toEqual(
      expect.objectContaining({ ...mockIngredient1, id: expect.any(String) })
    );
    expect(state.ingredients[1]).toEqual(
      expect.objectContaining({ ...mockIngredient2, id: expect.any(String) })
    );
  });

  test('должен удалять ингредиент по индексу (removeIngredient)', () => {
    let state = constructorReducer(initialState, addIngredient(mockIngredient1));
    state = constructorReducer(state, addIngredient(mockIngredient2));
    const result = constructorReducer(state, removeIngredient(0));

    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toEqual(
      expect.objectContaining({ ...mockIngredient2, id: expect.any(String) })
    );
  });

  test('должен перемещать ингредиент (moveIngredient)', () => {
    let state = constructorReducer(initialState, addIngredient(mockIngredient1));
    state = constructorReducer(state, addIngredient(mockIngredient2));

    const result = constructorReducer(state, moveIngredient({ from: 1, to: 0 }));

    expect(result.ingredients[0]).toEqual(
      expect.objectContaining({ ...mockIngredient2, id: expect.any(String) })
    );
    expect(result.ingredients[1]).toEqual(
      expect.objectContaining({ ...mockIngredient1, id: expect.any(String) })
    );
  });

  test('должен полностью сбрасывать состояние конструктора (resetConstructor)', () => {
    let state = constructorReducer(initialState, addBun(mockBun));
    state = constructorReducer(state, addIngredient(mockIngredient1));
    state = constructorReducer(state, {
      type: createOrder.fulfilled.type,
      payload: { name: 'Заказ', number: 123 } as TOrder,
    });

    const result = constructorReducer(state, resetConstructor());
    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([]);
    expect(result.orderModalData).toBeNull();
    expect(result.orderError).toBeNull();
  });

  test('должен устанавливать orderRequest в true при createOrder.pending', () => {
    const result = constructorReducer(initialState, { type: createOrder.pending.type });
    expect(result.orderRequest).toBe(true);
    expect(result.orderError).toBeNull();
  });

  test('должен сохранять данные заказа и очищать конструктор при createOrder.fulfilled', () => {
    let state = constructorReducer(initialState, addBun(mockBun));
    state = constructorReducer(state, addIngredient(mockIngredient1));

    const mockOrder: TOrder = { name: 'Тестовый заказ', number: 999 } as TOrder;
    const action = { type: createOrder.fulfilled.type, payload: mockOrder };

    const result = constructorReducer(state, action);
    expect(result.orderRequest).toBe(false);
    expect(result.orderModalData).toEqual(mockOrder);
    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([]);
  });

  test('должен устанавливать orderError при createOrder.rejected', () => {
    const action = {
      type: createOrder.rejected.type,
      payload: 'Не удалось оформить заказ',
    };
    const result = constructorReducer(initialState, action);
    expect(result.orderRequest).toBe(false);
    expect(result.orderError).toBe('Не удалось оформить заказ');
  });
});
