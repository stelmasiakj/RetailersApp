import throttle from 'lodash.throttle';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ListRenderItem, RefreshControl, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {TransactionListItemPresenter} from '~/Transaction/components';
import {
  TRANSACTION_LIST_ITEM_HEIGHT,
  TRANSACTION_LIST_ITEM_SEPARATOR,
} from '~/Transaction/constants';
import {EmptyView, ErrorView} from '~/components';
import {useStylesheet} from '~/designSystem';
import {TransactionListItem} from '~/domain';

export const TransactionListBase = memo(
  ({
    areAllItemsLoaded = true,
    isError,
    isFetching,
    items,
    page = 1,
    loadCallback,
  }: {
    areAllItemsLoaded?: boolean;
    isError: boolean;
    isFetching: boolean;
    items: TransactionListItem[] | null;
    page?: number;
    loadCallback: (page: number) => Promise<unknown>;
  }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [t] = useTranslation();

    const styles = useStylesheet(
      ({colors, spacing}) => ({
        list: {
          flex: 1,
          backgroundColor: colors.background,
        },
        listContent: {
          padding: spacing[20],
          minHeight: '100%',
        },
        separator: {
          height: TRANSACTION_LIST_ITEM_SEPARATOR,
        },
      }),
      [],
    );

    useEffect(() => {
      loadCallback(1);
    }, [loadCallback]);

    const renderItem: ListRenderItem<TransactionListItem> = useCallback(
      ({item}) => {
        return <TransactionListItemPresenter item={item} />;
      },
      [],
    );

    const keyExtractor = useCallback(
      (i: TransactionListItem) => i.id.toString(),
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

    const onRefresh = useCallback(async () => {
      setIsRefreshing(true);
      await loadCallback(1);
      setIsRefreshing(false);
    }, [loadCallback]);

    const refreshControl = useMemo(
      () => <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />,
      [onRefresh, isRefreshing],
    );

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
          loadCallback(page + 1);
        }, 1000),
      [page, loadCallback, shouldLoadMore],
    );

    const ItemSeparator = useCallback(
      () => <View style={styles.separator} />,
      [styles],
    );

    return (
      <FlatList
        data={items}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        ItemSeparatorComponent={ItemSeparator}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
        refreshControl={refreshControl}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
      />
    );
  },
);

const getItemLayout = (
  data: Array<TransactionListItem> | null | undefined,
  index: number,
): {length: number; offset: number; index: number} => {
  if (!data) {
    return {index: 0, length: 0, offset: 0};
  }
  return {
    index,
    length: TRANSACTION_LIST_ITEM_HEIGHT,
    offset:
      (TRANSACTION_LIST_ITEM_HEIGHT + TRANSACTION_LIST_ITEM_SEPARATOR) * index,
  };
};
