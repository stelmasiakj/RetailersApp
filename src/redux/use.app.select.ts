import {TypedUseSelectorHook, useSelector} from 'react-redux';
import type {TRootState} from './types';

export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector;
