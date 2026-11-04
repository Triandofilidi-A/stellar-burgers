import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

import { orderBurgerApi } from '../../utils/burger-api';

import type { RootState, AppDispatch } from '../store';
import type { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';

const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  orderError: null,
};

export const createOrder = createAsyncThunk<
  TOrder,
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('constructor/createOrder', async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const { bun, ingredients } = state.burgerConstructor;

  if (!bun) {
    return rejectWithValue('Необходимо выбрать булку для заказа');
  }

  try {
    const ingredientIds = [
      bun._id,
      ...ingredients.map((ing: TConstructorIngredient) => ing._id),
      bun._id,
    ];
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Не удалось оформить заказ';
    return rejectWithValue(errorMessage);
  }
});

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addBun: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.bun = action.payload;
        state.orderError = null;
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: generateUniqueId(),
        } as TConstructorIngredient,
      }),
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
        state.orderError = null;
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: generateUniqueId(),
        } as TConstructorIngredient,
      }),
    },
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients.splice(action.payload, 1);
    },
    moveIngredient: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload;
      const [moved] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, moved);
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.orderModalData = null;
      state.orderError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.orderError = null;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload ?? 'Произошла ошибка при оформлении заказа';
      });
  },
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
} = constructorSlice.actions;

export const selectConstructorBun = (state: RootState): TConstructorIngredient | null =>
  state.burgerConstructor.bun ?? null;

export const selectConstructorIngredients = (
  state: RootState
): TConstructorIngredient[] => state.burgerConstructor.ingredients ?? [];

export const selectConstructorItems = (
  state: RootState
): {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
} => ({
  bun: state.burgerConstructor.bun ?? null,
  ingredients: state.burgerConstructor.ingredients ?? [],
});

export const selectOrderRequest = (state: RootState): boolean =>
  state.burgerConstructor.orderRequest;

export const selectOrderModalData = (state: RootState): TOrder | null =>
  state.burgerConstructor.orderModalData ?? null;

export const selectOrderError = (state: RootState): string | null =>
  state.burgerConstructor.orderError ?? null;

export const constructorReducer = constructorSlice.reducer;

export default constructorReducer;
