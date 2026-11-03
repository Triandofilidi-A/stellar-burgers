import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  loginUserApi,
  getUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

import type { RootState, AppDispatch } from '../store';
import type { TUser } from '@utils-types';

export type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

export const checkUserAuth = createAsyncThunk<
  TUser,
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('user/checkUserAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await getUserApi();
    return response.user;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Ошибка проверки авторизации';
    return rejectWithValue(errorMessage);
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  { email: string; password: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка входа';
    return rejectWithValue(errorMessage);
  }
});

export const registerUser = createAsyncThunk<
  TUser,
  { name: string; email: string; password: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка регистрации';
    return rejectWithValue(errorMessage);
  }
});

export const updateUser = createAsyncThunk<
  TUser,
  { name: string; email: string; password: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('user/updateUser', async (data, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(data);
    return response.user;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Ошибка обновления данных';
    return rejectWithValue(errorMessage);
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('user/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка выхода';
    return rejectWithValue(errorMessage);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
        state.user = null;
        state.isLoading = false;
        state.error = null;
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка входа';
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка регистрации';
      })

      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка обновления данных';
      })

      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка выхода';
      });
  },
});

export const selectUser = (state: RootState): TUser | null => state.user.user;

export const selectIsAuthChecked = (state: RootState): boolean =>
  state.user.isAuthChecked;

export const selectIsUserLoading = (state: RootState): boolean => state.user.isLoading;

export default userSlice.reducer;
