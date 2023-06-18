import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  LayoutChangeEvent,
  RefreshControl,
  SectionList,
  View,
  ActivityIndicator,
} from 'react-native';
import {useAppDispatch} from '~/redux/use.app.dispatch';
import {getRetailersThunk} from '../../store';
import {useRetailers} from '../../hooks';
import {useStylesheet} from '~/designSystem';
import {RetailerListItem} from '~/domain';
import throttle from 'lodash.throttle';
import {Text} from 'react-native-paper';
import {EmptyView, ErrorView} from '~/components';
import {useTranslation} from 'react-i18next';
import {
  RETAILER_SEARCH_BAR_HEIGHT,
  RetailerListItemPresenter,
  RetailerSearch,
} from '~/Retailer/components';
import {
  RETAILER_LIST_ITEM_PRESENTER_HEIGHT,
  RETAILER_LIST_ITEM_SEPARATOR,
  RETAILER_LIST_SECTION_HEIGHT,
} from '~/Retailer/constants';
import {clampWorklet, getSectionListLayout} from '~/utils';
import {
  useCustomTabBarTranslate,
  useCustomTabbarHeight,
} from '~/navigationElements';

import {useIsFocused, useNavigation} from '@react-navigation/native';
import Animated, {
  FadeIn,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const RetailersSectionList = SectionList<
  RetailerListItem,
  {title: string; data: RetailerListItem[]}
>;

const AnimatedSectionList =
  Animated.createAnimatedComponent(RetailersSectionList);

export const RetailerListScreen = () => {
  const dispatch = useAppDispatch();
  const [height, setHeight] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {areAllItemsLoaded, isError, isFetching, items, page} = useRetailers();
  const [t] = useTranslation();
  const {top} = useSafeAreaInsets();

  const tabbarHeight = useCustomTabbarHeight();
  const styles = useStylesheet(
    ({colors, spacing}) => ({
      list: {
        flex: 1,
        backgroundColor: colors.background,
      },
      listContent: {
        padding: spacing[20],
        paddingBottom: spacing[20] + tabbarHeight,
        paddingTop: top + 2 * spacing[20] + RETAILER_SEARCH_BAR_HEIGHT,
        minHeight: height,
      },
      separator: {
        height: RETAILER_LIST_ITEM_SEPARATOR,
      },
      section: {
        height: RETAILER_LIST_SECTION_HEIGHT,
        backgroundColor: colors.surface,
        justifyContent: 'center',
      },
      statusBar: {
        height: top,
        backgroundColor: colors.background,
        opacity: 0.9,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      },
    }),
    [height, tabbarHeight, top],
  );

  useEffect(() => {
    dispatch(getRetailersThunk({page: 1}));
  }, [dispatch]);

  const keyExtractor = useCallback(
    (i: RetailerListItem) => i.id.toString(),
    [],
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => setHeight(e.nativeEvent.layout.height),
    [],
  );

  const ListEmptyComponent = useCallback(() => {
    if (isError) {
      return <ErrorView />;
    } else if (!isRefreshing && isFetching) {
      return null;
    } else {
      return <EmptyView title={t('noData')} />;
    }
  }, [isError, isRefreshing, isFetching, t]);

  const ListFooterComponent = useCallback(() => {
    if (areAllItemsLoaded || isError) {
      return null;
    } else {
      return <ActivityIndicator />;
    }
  }, [areAllItemsLoaded, isError]);

  const shouldLoadMore =
    !isFetching &&
    !isRefreshing &&
    !areAllItemsLoaded &&
    !!items &&
    !!items.length &&
    !!page &&
    !isError;

  const onEndReached = useMemo(
    () =>
      throttle(() => {
        if (!shouldLoadMore) {
          return;
        }
        dispatch(getRetailersThunk({page: page + 1}));
      }, 1000),
    [page, dispatch, shouldLoadMore],
  );

  const ItemSeparator = useCallback(
    () => <View style={styles.separator} />,
    [styles],
  );

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await dispatch(getRetailersThunk({page: 1}));
    setIsRefreshing(false);
  }, [dispatch]);

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />,
    [onRefresh, isRefreshing],
  );

  const navigation = useNavigation();
  const navigateToRetailerDetails = useCallback(
    (id: number) => {
      navigation.navigate('AppTabs', {
        screen: 'Retailer',
        params: {screen: 'RetailerDetails', params: {id}},
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({
      item,
    }: {
      item: RetailerListItem;
      index: number;
      section: {title: string; data: RetailerListItem[]};
    }) => (
      <Animated.View entering={FadeIn}>
        <RetailerListItemPresenter
          item={item}
          onPress={navigateToRetailerDetails}
        />
      </Animated.View>
    ),
    [navigateToRetailerDetails],
  );

  const renderSectionHeader = useCallback(
    ({section}: {section: {title: string}}) => {
      return (
        <Animated.View entering={FadeIn} style={styles.section}>
          <Text variant="labelMedium">{section.title}</Text>
        </Animated.View>
      );
    },
    [styles],
  );

  const getItemLayout = useMemo(
    () =>
      getSectionListLayout({
        getItemHeight: () => RETAILER_LIST_ITEM_PRESENTER_HEIGHT,
        getSeparatorHeight: () => RETAILER_LIST_ITEM_SEPARATOR,
        getSectionHeaderHeight: () => RETAILER_LIST_SECTION_HEIGHT,
      }),
    [],
  );

  const tabBarTranslateY = useCustomTabBarTranslate();
  const isFocused = useIsFocused();

  const onScroll = useAnimatedScrollHandler<{
    prevScrollY: number;
    clamp: number;

    initialScrollY: number;
  }>(
    {
      onBeginDrag: (event, ctx) => {
        const maxAllowedScrollY =
          event.contentSize.height - event.layoutMeasurement.height;
        const scrollY = clampWorklet(
          event.contentOffset.y,
          0,
          maxAllowedScrollY,
        );

        ctx.initialScrollY = scrollY;
      },
      onScroll: (event, ctx) => {
        const maxAllowedScrollY =
          event.contentSize.height - event.layoutMeasurement.height;
        const scrollY = clampWorklet(
          event.contentOffset.y,
          0,
          maxAllowedScrollY,
        );

        if (scrollY - ctx.initialScrollY > 30 && isFocused) {
          tabBarTranslateY.value = withTiming(tabbarHeight);
        } else if (scrollY - ctx.initialScrollY < -30 && isFocused) {
          tabBarTranslateY.value = withTiming(0);
        }
      },
    },
    [tabbarHeight, isFocused],
  );

  useEffect(() => {
    if (!isFocused) {
      tabBarTranslateY.value = withTiming(0);
    }
  }, [isFocused, tabBarTranslateY]);

  return (
    <View style={styles.list} testID="RetailerListScreenContainer">
      <AnimatedSectionList
        testID={'RetailerList'}
        sections={items || []}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        onLayout={onLayout}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        refreshControl={refreshControl}
        scrollEventThrottle={16}
        stickySectionHeadersEnabled={false}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
        getItemLayout={getItemLayout}
        onScroll={onScroll}
      />
      <RetailerSearch />
    </View>
  );
};
