import {memo, useCallback} from 'react';
import {FlatList, ListRenderItem, View} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {useStylesheet} from '~/designSystem';
import {RetailerListItem} from '~/domain';
import {RetailerListItemPresenter} from '../retailer.list.item.presenter';
import {useRetailersSearch} from '~/Retailer/hooks';
import {RETAILER_LIST_ITEM_SEPARATOR} from '~/Retailer/constants';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  RETAILER_SEARCH_BAR_MARGIN,
  RETAILER_SEARCH_BAR_HEIGHT,
} from './constants';

export const RetailerSearchContent = memo(
  ({onRetailerPressed}: {onRetailerPressed: (id: number) => void}) => {
    const {top} = useSafeAreaInsets();

    const styles = useStylesheet(
      ({spacing}) => ({
        list: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: top + RETAILER_SEARCH_BAR_MARGIN + RETAILER_SEARCH_BAR_HEIGHT,
        },
        listContent: {
          padding: spacing[20],

          minHeight: '100%',
        },
        separator: {
          height: RETAILER_LIST_ITEM_SEPARATOR,
        },
        notFound: {
          textAlign: 'center',
        },
      }),
      [top],
    );

    const renderItem: ListRenderItem<RetailerListItem> = useCallback(
      ({item}) => (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <RetailerListItemPresenter item={item} onPress={onRetailerPressed} />
        </Animated.View>
      ),
      [onRetailerPressed],
    );

    const keyExtractor = useCallback(
      (item: RetailerListItem) => item.id.toString(),
      [],
    );

    const retailers = useRetailersSearch();
    const notFound = !!retailers && !retailers.length;

    const [t] = useTranslation();
    const ListEmpty = useCallback(() => {
      if (notFound) {
        return (
          <Text variant="bodyMedium" style={styles.notFound}>
            {t('retailer.notFound')}
          </Text>
        );
      } else {
        return null;
      }
    }, [notFound, styles, t]);

    const ItemSeparator = useCallback(
      () => <View style={styles.separator} />,
      [styles],
    );

    return (
      <FlatList
        testID="RetailerSearchContent"
        data={retailers}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={ListEmpty}
        keyboardShouldPersistTaps="handled"
      />
    );
  },
);
