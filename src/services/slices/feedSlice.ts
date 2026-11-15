import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getFeedsApi, getOrdersApi, getOrderByNumberApi } from '../../utils/burger-api';

import type { RootState, AppDispatch } from '../store';
import type { TFeedState, TOrder, TOrdersData } from '@utils-types';

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const fetchFeeds = createAsyncThunk<
  TOrdersData,
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('feed/fetchFeeds', async (_, { rejectWithValue }) => {
  try {
    const response = await getFeedsApi();
    return response;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Ошибка загрузки ленты заказов';
    return rejectWithValue(errorMessage);
  }
});

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('feed/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    const orders = await getOrdersApi();
    return orders;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Ошибка загрузки истории заказов';
    return rejectWithValue(errorMessage);
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('feed/fetchOrderByNumber', async (orderNumber, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(orderNumber);
    if (response.orders && response.orders.length > 0) {
      return response.orders[0];
    }
    return rejectWithValue('Заказ не найден');
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Ошибка загрузки заказа';
    return rejectWithValue(errorMessage);
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка загрузки ленты заказов';
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка загрузки истории заказов';
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order.number === action.payload.number
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        } else {
          state.orders.push(action.payload);
        }
      });
  },
});

export const selectFeedOrders = (state: RootState): TOrder[] => state.feed.orders;

export const selectFeedTotal = (state: RootState): number => state.feed.total;

export const selectFeedTotalToday = (state: RootState): number => state.feed.totalToday;

export const selectFeedIsLoading = (state: RootState): boolean => state.feed.isLoading;

export const selectFeedError = (state: RootState): string | null => state.feed.error;

export const selectOrderByNumber =
  (orderNumber: number) =>
  (state: RootState): TOrder | undefined =>
    state.feed.orders.find((order) => order.number === orderNumber);
export default feedSlice.reducer;
