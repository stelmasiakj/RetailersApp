import {memo, useCallback, useEffect} from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppHeaderHeight} from '~/components';
import {useStylesheet} from '~/designSystem';
import {RetailerListItem} from '~/domain';
import {RetailerListItemPresenter} from '../retailer.list.item.presenter';
import {useRetailersSearch} from '~/Retailer/hooks';
import {RETAILER_LIST_ITEM_SEPARATOR} from '~/Retailer/constants';
import {Text} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

export const RetailerSearchContent = memo(
  ({
    isFocused,
    onRetailerPressed,
  }: {
    isFocused: boolean;
    onRetailerPressed: (id: number) => void;
  }) => {
    const focusTransition = useSharedValue(isFocused ? 1 : 0);

    useEffect(() => {
      focusTransition.value = withTiming(isFocused ? 1 : 0);
    }, [focusTransition, isFocused]);

    const headerHeight = useAppHeaderHeight();
    const styles = useStylesheet(
      ({colors, spacing}) => ({
        container: {
          backgroundColor: colors.background,
          ...StyleSheet.absoluteFillObject,
          top: headerHeight,
          borderTopColor: colors.onBackground,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        list: {
          flex: 1,
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
      [headerHeight],
    );

    const {height: screenHeight} = useWindowDimensions();

    const hiddenPosition = -screenHeight;

    const animatedStyle = useAnimatedStyle(
      () => ({
        transform: [
          {
            translateY: interpolate(
              focusTransition.value,
              [0, 1],
              [hiddenPosition, 0],
            ),
          },
        ],
      }),
      [hiddenPosition],
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
      <Animated.View
        style={[styles.container, animatedStyle]}
        testID="RetailerSearchContent">
        <FlatList
          data={retailers}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={ItemSeparator}
          ListEmptyComponent={ListEmpty}
          keyboardShouldPersistTaps="handled"
        />
      </Animated.View>
    );
  },
);
