import {createSelector} from '@reduxjs/toolkit';
import {useMemo} from 'react';
import type {TRootState} from '~/redux/types';
import {useAppSelector} from '~/redux/use.app.select';

const selectAuth = (state: TRootState) => state.auth;

const selectIsInitDone = createSelector(selectAuth, a => a.isInitDone);

const selectToken = createSelector(selectAuth, a => a.token);

export const useAuthState = () => {
  const isInitDone = useAppSelector(selectIsInitDone);
  const token = useAppSelector(selectToken);

  return useMemo(() => {
    if (!isInitDone) {
      return 'NOT_DETERMINED';
    } else if (token) {
      return 'SIGNED_IN';
    } else {
      return 'NOT_SIGNED_IN';
    }
  }, [isInitDone, token]);
};
