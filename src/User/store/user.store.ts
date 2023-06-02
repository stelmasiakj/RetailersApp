import {createSlice} from '@reduxjs/toolkit';
import {getProfileThunk} from './get.profile.thunk';
import {updateProfileThunk} from './update.profile.thunk';

interface IUserState {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;

  isFetchingProfile: boolean;
  isFetchingProfileError: boolean;
}

const initialState: IUserState = {
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  isFetchingProfile: false,
  isFetchingProfileError: false,
};

const userStore = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getProfileThunk.pending, state => {
        state.isFetchingProfile = true;
      })
      .addCase(getProfileThunk.rejected, state => {
        state.isFetchingProfile = false;
        state.isFetchingProfileError = true;
      })
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.isFetchingProfile = false;
        state.isFetchingProfileError = false;

        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
        state.id = action.payload.id;
      });

    builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
      state.firstName = action.meta.arg.firstName;
      state.lastName = action.meta.arg.lastName;
      state.email = action.meta.arg.email;
    });
  },
});

export const userReducer = userStore.reducer;
