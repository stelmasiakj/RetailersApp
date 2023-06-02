import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  LayoutChangeEvent,
  RefreshControl,
  SectionList,
  View,
} from 'react-native';
import {useAppDispatch} from '~/redux/use.app.dispatch';
import {getRetailersThunk} from '../../store';
import {useRetailers} from '../../hooks.ts';
import {useStylesheet} from '~/designSystem';
import {RetailerListItem} from '~/domain';
import throttle from 'lodash.throttle';
import {ActivityIndicator, Text} from 'react-native-paper';
import {EmptyView, ErrorView} from '~/components';
import {useTranslation} from 'react-i18next';
import {RetailerListItemPresenter} from '~/Retailer/components';
import {
  RETAILER_LIST_ITEM_PRESENTER_HEIGHT,
  RETAILER_LIST_ITEM_SEPARATOR,
  RETAILER_LIST_SECTION_HEIGHT,
} from '~/Retailer/constants';
import {getSectionListLayout} from '~/utils';

export const RetailerListScreen = () => {
  const dispatch = useAppDispatch();
  const [height, setHeight] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {areAllItemsLoaded, isError, isFetching, items, page} = useRetailers();
  const [t] = useTranslation();

  const styles = useStylesheet(
    ({colors, spacing}) => ({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      list: {
        flex: 1,
      },
      listContent: {
        padding: spacing[20],
        minHeight: height,
      },
      separator: {
        height: RETAILER_LIST_ITEM_SEPARATOR,
      },
    }),
    [height],
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

  const renderItem = useCallback(
    ({
      item,
    }: {
      item: RetailerListItem;
      index: number;
      section: {title: string; data: RetailerListItem[]};
    }) => <RetailerListItemPresenter item={item} />,
    [],
  );

  const renderSectionHeader = useCallback(
    ({section}: {section: {title: string}}) => {
      return (
        <View
          style={{
            height: RETAILER_LIST_SECTION_HEIGHT,
            backgroundColor: 'green',
            justifyContent: 'center',
          }}>
          <Text variant="labelMedium">{section.title}</Text>
        </View>
      );
    },
    [],
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

  return (
    <View style={styles.container}>
      <SectionList
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
        stickySectionHeadersEnabled
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
        getItemLayout={getItemLayout}
      />
    </View>
  );
};
