import throttle from 'lodash.throttle';
import {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  InteractionManager,
  LayoutAnimation,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TransactionListItemPresenter} from '~/Transaction/components';
import {TRANSACTION_LIST_ITEM_SEPARATOR} from '~/Transaction/constants';
import {EmptyView, ErrorView} from '~/components';
import {OptionsBottomSheet} from '~/components/OptionsBottomSheet/options.bottom.sheet';
import {useStylesheet} from '~/designSystem';
import {TransactionListItem} from '~/domain';
import {useAppDispatch} from '~/redux/use.app.dispatch';
import {markTransactionAsFinishedThunk} from '../../store/mark.transaction.as.finished.thunk';
import {TransactionListBaseProps} from './transaction.list.base.props';
import {getItemLayout} from './get.item.layout';

export const TransactionListBase = memo(
  ({
    areAllItemsLoaded = true,
    isError,
    isFetching,
    items,
    page = 1,
    loadCallback,
    contentContainerStyle,
    topInset = 0,
    ...props
  }: TransactionListBaseProps) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [t] = useTranslation();
    const [itemsCore, setItemsCore] = useState(items);

    useEffect(() => setItemsCore(items), [items]);

    const styles = useStylesheet(
      ({colors, spacing}) => ({
        list: {
          flex: 1,
          backgroundColor: colors.background,
        },
        listContent: {
          padding: spacing[20],
          paddingTop: spacing[20] + topInset,
          minHeight: '100%',
        },
        separator: {
          height: TRANSACTION_LIST_ITEM_SEPARATOR,
        },
      }),
      [topInset],
    );

    useEffect(() => {
      loadCallback(1);
    }, [loadCallback]);

    const [isOptionsBottomSheetVisible, setIsOptionsBottomSheetVisible] =
      useState(false);
    const optionsItem = useRef<TransactionListItem>();
    const optionsItemIndex = useRef<number>();

    const options = useMemo(
      () => [
        {id: 'DELETE', label: t('transactions.markAsFinished'), icon: 'cash'},
      ],
      [t],
    );

    const hideOptionsBottomSheet = useCallback(() => {
      setIsOptionsBottomSheetVisible(false);
    }, []);

    const showOptionsBottomSheet = useCallback(
      (item: TransactionListItem, index: number) => {
        optionsItem.current = item;
        optionsItemIndex.current = index;
        setIsOptionsBottomSheetVisible(true);
      },
      [],
    );

    const renderItem: ListRenderItem<TransactionListItem> = useCallback(
      ({item, index}) => {
        return (
          <TransactionListItemPresenter
            item={item}
            index={index}
            onOptions={showOptionsBottomSheet}
          />
        );
      },
      [showOptionsBottomSheet],
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
      () => (
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          progressViewOffset={topInset}
        />
      ),
      [onRefresh, isRefreshing, topInset],
    );

    const shouldLoadMore =
      !isFetching &&
      !isRefreshing &&
      !areAllItemsLoaded &&
      !!items &&
      !!items.length &&
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

    const targetContentContainerStyle = useMemo(
      () => StyleSheet.flatten([styles.listContent, contentContainerStyle]),
      [styles, contentContainerStyle],
    );
    const {top} = useSafeAreaInsets();
    const scrollIndicatorInsets = useMemo(
      () => ({
        top: topInset - top,
      }),
      [topInset, top],
    );

    const dispatch = useAppDispatch();
    const markAsFinished = useCallback(async () => {
      const item = optionsItem.current;
      const index = optionsItemIndex.current;
      if (item && typeof index === 'number') {
        LayoutAnimation.configureNext({
          duration: 500,

          update: {
            type: 'easeInEaseOut',
            property: 'scaleX',
            duration: 500,
            delay: 500,
          },
        });
        setItemsCore(curr => {
          curr!.splice(index, 1);
          return [...curr!];
        });
        InteractionManager.runAfterInteractions(() => {
          hideOptionsBottomSheet();
        });
        try {
          await dispatch(
            markTransactionAsFinishedThunk({id: item.id}),
          ).unwrap();
        } catch {
          LayoutAnimation.configureNext({
            duration: 500,

            update: {
              type: 'easeInEaseOut',
              property: 'scaleX',
              duration: 500,
              delay: 500,
            },
          });

          setItemsCore(curr => [
            ...curr!.slice(0, index),
            item,
            ...curr!.slice(index),
          ]);
        }
      }
    }, [dispatch, hideOptionsBottomSheet]);

    return (
      <>
        <Animated.FlatList
          data={itemsCore}
          style={styles.list}
          contentContainerStyle={targetContentContainerStyle}
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
          scrollIndicatorInsets={scrollIndicatorInsets}
          initialNumToRender={6}
          {...props}
        />
        <OptionsBottomSheet
          isVisible={isOptionsBottomSheetVisible}
          onClose={hideOptionsBottomSheet}
          onOptionPress={markAsFinished}
          options={options}
        />
      </>
    );
  },
);
