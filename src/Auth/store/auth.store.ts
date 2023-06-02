import {createSlice} from '@reduxjs/toolkit';
import {initAuthThunk} from './init.auth.thunk';
import {loginThunk} from './login.thunk';
import {logoutThunk} from './logout.thunk';

interface IAuthState {
  token: string | null;
  isInitDone: boolean;
}

const initialState: IAuthState = {
  token: null,
  isInitDone: false,
};

const authStore = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(initAuthThunk.fulfilled, (state, action) => {
        state.token = action.payload.token || null;
        state.isInitDone = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.token = null;
      });
  },
});

export const authReducer = authStore.reducer;
