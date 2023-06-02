import {createAsyncThunk} from '@reduxjs/toolkit';
import type {TRootState, TAppDispatch} from './types';
import {AxiosError} from 'axios';

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: TRootState;
  dispatch: TAppDispatch;
  rejectValue: AxiosError;
}>();
