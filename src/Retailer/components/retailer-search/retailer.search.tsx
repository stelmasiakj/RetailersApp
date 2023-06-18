import {useApplicationTheme} from '~/designSystem';
import {useHideTabBar, useShowTabBar} from '~/navigationElements';
import {
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTransition} from '~/utils';
import {RetailerSearchBackground} from './retailer.search.background';
import {RetailerSearchDivider} from './retailer.search.divider';
import {RetailerSearchBar} from './retailer.search.bar';
import {useAppDispatch} from '~/redux/use.app.dispatch';
import {
  resetSearchedRetailersAction,
  searchRetailersThunk,
} from '~/Retailer/store';
import {useNavigation} from '@react-navigation/native';
import debounce from 'lodash.debounce';
import {Keyboard} from 'react-native';
import {RetailerSearchContent} from './retailer.search.content';

export const RetailerSearch = () => {
  const showTabbar = useShowTabBar();
  const hideTabbar = useHideTabBar();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const searchPromise = useRef<{abort: (reason?: string) => void}>();

  const [isOpened, setIsOpened] = useState(false);
  const [inputMode, setInputMode] = useState<'input' | 'sudo'>('sudo');
  const openTransition = useTransition(isOpened);

  useAnimatedReaction(
    () => openTransition.value,
    (curr, prev) => {
      if (curr === 1 && (prev || 0) < 1) {
        runOnJS(setInputMode)('input');
      } else if (curr === 0 && (prev || 0) > 0) {
        runOnJS(setInputMode)('sudo');
      }
    },
    [],
  );

  const open = useCallback(() => {
    dispatch(resetSearchedRetailersAction());
    hideTabbar();
    setIsOpened(true);
  }, [hideTabbar, dispatch]);

  const close = useCallback(() => {
    dispatch(resetSearchedRetailersAction());
    showTabbar();
    setIsOpened(false);
  }, [showTabbar, dispatch]);

  const navigation = useNavigation();
  const navigateToRetailerDetails = useCallback(
    (id: number) => {
      Keyboard.dismiss();
      close();
      navigation.navigate('AppTabs', {
        screen: 'Retailer',
        params: {screen: 'RetailerDetails', params: {id}},
      });
    },
    [navigation, close],
  );

  const {
    colors: {
      background: openedBackground,
      elevation: {level2: notOpenedBackground},
    },
  } = useApplicationTheme();

  const backroundColorAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        openTransition.value,
        [0, 1],
        [notOpenedBackground, openedBackground],
      ),
    };
  }, [openedBackground, notOpenedBackground]);

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
    [searchCore],
  );

  useEffect(() => {
    if (!isOpened) {
      setSearch('');
    }
  }, [isOpened]);

  return (
    <>
      <RetailerSearchBar
        inputMode={inputMode}
        onClose={close}
        onOpen={open}
        style={backroundColorAnimatedStyle}
        openTransition={openTransition}
        value={search}
        onChangeText={onSearch}
      />

      <RetailerSearchBackground
        openTransition={openTransition}
        style={backroundColorAnimatedStyle}
      />
      <RetailerSearchDivider openTransition={openTransition} />
      {isOpened && (
        <RetailerSearchContent onRetailerPressed={navigateToRetailerDetails} />
      )}
    </>
  );
};
