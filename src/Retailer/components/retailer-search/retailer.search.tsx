import {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Portal} from '@gorhom/portal';
import {StyleSheet, View} from 'react-native';
import {RetailerSearchHeader} from './retailer.search.header';
import {RetailerSearchContent} from './retailer.search.content';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useAppDispatch} from '~/redux/use.app.dispatch';
import {
  resetSearchedRetailersAction,
  searchRetailersThunk,
} from '~/Retailer/store';
import debounce from 'lodash.debounce';

export const RetailerSearch = memo(() => {
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const searchPromise = useRef<{abort: (reason?: string) => void}>();

  const focus = useCallback(() => {
    dispatch(resetSearchedRetailersAction());
    setIsFocused(true);
  }, [dispatch]);

  const blur = useCallback(() => {
    dispatch(resetSearchedRetailersAction());
    setIsFocused(false);
  }, [dispatch]);

  const isNavigationFocused = useIsFocused();

  const searchCore = useMemo(
    () =>
      debounce((s: string) => {
        if (s) {
          searchPromise.current = dispatch(searchRetailersThunk({search: s}));
        } else {
          dispatch(resetSearchedRetailersAction());
        }
      }, 300),
    [dispatch],
  );

  const onSearch = useCallback(
    (value: string) => {
      setSearch(value);
      searchPromise.current?.abort();
      searchCore(value);
    },
    [dispatch, searchCore],
  );

  useEffect(() => {
    if (!isFocused) {
      setSearch('');
    }
  }, [isFocused]);

  const navigation = useNavigation();
  const navigateToRetailerDetails = useCallback(
    (id: number) => {
      blur();
      navigation.navigate('AppTabs', {
        screen: 'Retailer',
        params: {screen: 'RetailerDetails', params: {id}},
      });
    },
    [navigation, blur],
  );

  if (!isNavigationFocused) {
    return null;
  }

  return (
    <Portal>
      <View
        style={StyleSheet.absoluteFillObject}
        pointerEvents={isFocused ? 'auto' : 'box-none'}>
        <RetailerSearchContent
          isFocused={isFocused}
          onRetailerPressed={navigateToRetailerDetails}
        />
        <RetailerSearchHeader
          isFocused={isFocused}
          onFocus={focus}
          onBlur={blur}
          search={search}
          onChangeSearch={onSearch}
        />
      </View>
    </Portal>
  );
});
