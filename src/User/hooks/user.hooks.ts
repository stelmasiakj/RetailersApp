import {createSelector} from '@reduxjs/toolkit';
import type {TRootState} from '~/redux/types';
import {useAppSelector} from '~/redux/use.app.select';

const selectUser = (state: TRootState) => state.user;

const selectUserId = createSelector(selectUser, u => u.id);
const selectFirstName = createSelector(selectUser, u => u.firstName);
const selectLastName = createSelector(selectUser, u => u.lastName);
const selectEmail = createSelector(selectUser, u => u.email);
const selectIsFetchingProfile = createSelector(
  selectUser,
  u => u.isFetchingProfile,
);
const selectIsFetchingProfileError = createSelector(
  selectUser,
  u => u.isFetchingProfileError,
);

const selectProfile = createSelector(
  selectUserId,
  selectFirstName,
  selectLastName,
  selectEmail,
  selectIsFetchingProfile,
  selectIsFetchingProfileError,
  (id, firstName, lastName, email, isFetching, isError) => {
    return {
      isError,
      isFetching,
      profile: id
        ? {
            id,
            lastName: lastName || '',
            email: email || '',
            firstName: firstName || '',
          }
        : null,
    };
  },
);

export const useProfile = () => useAppSelector(selectProfile);
