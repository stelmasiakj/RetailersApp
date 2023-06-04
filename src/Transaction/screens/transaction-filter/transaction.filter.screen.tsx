import {useNavigation} from '@react-navigation/native';
import {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform, Pressable, View} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTransactionsFilter} from '~/Transaction/hooks';
import {
  getTransactionsThunk,
  resetTransactionListAction,
  setTransactionFilterAction,
} from '~/Transaction/store';
import {AppHeader, DatePicker} from '~/components';
import {useStylesheet} from '~/designSystem';
import {useAppDispatch} from '~/redux/use.app.dispatch';
import {formatDate} from '~/utils';
import {RetailerChip} from './retailer.chip';

export const TransactionFilterScreen = () => {
  const [t] = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const currentFilter = useTransactionsFilter();
  const [minStart, setMinStart] = useState<Date | null>(() =>
    currentFilter.minStart ? new Date(currentFilter.minStart) : null,
  );
  const [maxStart, setMaxStart] = useState<Date | null>(() =>
    currentFilter.maxStart ? new Date(currentFilter.maxStart) : null,
  );
  const [retailers, setRetailers] = useState(currentFilter.retailerIds || []);

  const styles = useStylesheet(
    ({colors, spacing}) => ({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      content: {
        flex: 1,
        padding: spacing[20],
        paddingBottom: Math.max(spacing[20], bottom),
        justifyContent: 'space-between',
      },
      clearButton: {
        color: colors.primary,
        right: spacing[16],
      },
      label: {
        fontWeight: '700',
      },
      labelMargin: {
        marginBottom: spacing[16],
      },
      labelWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      dateRange: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing[32],
        gap: spacing[32],
      },
      retailers: {
        gap: spacing[8],
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
      },
    }),
    [bottom],
  );

  const onClearFilter = useCallback(() => {
    setMaxStart(null);
    setMinStart(null);
    setRetailers([]);
  }, []);

  const isDefault = retailers.length === 0 && !minStart && !maxStart;
  const hasChanged = useMemo(() => {
    const dateDefault = new Date();
    const isMinTheSame =
      (minStart || dateDefault).getTime() ===
      (currentFilter.minStart
        ? new Date(currentFilter.minStart)
        : dateDefault
      ).getTime();
    const isMaxTheSame =
      (maxStart || dateDefault).getTime() ===
      (currentFilter.maxStart
        ? new Date(currentFilter.maxStart)
        : dateDefault
      ).getTime();
    const areRetailersTheSame =
      JSON.stringify(retailers.sort((i, j) => i - j)) ===
      JSON.stringify((currentFilter.retailerIds || []).sort((i, j) => i - j));

    return !(isMinTheSame && isMaxTheSame && areRetailersTheSame);
  }, [currentFilter, minStart, maxStart, retailers]);

  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const applyFilter = useCallback(() => {
    dispatch(resetTransactionListAction());
    dispatch(
      setTransactionFilterAction(
        isDefault
          ? null
          : {
              minStart: minStart ? minStart.toString() : null,
              maxStart: maxStart ? maxStart.toString() : null,

              retailerIds: retailers,
            },
      ),
    );
    dispatch(getTransactionsThunk({page: 1, type: 'ACTIVE'}));
    dispatch(getTransactionsThunk({page: 1, type: 'FINISHED'}));
    navigation.goBack();
  }, [isDefault, minStart, maxStart, retailers, navigation, dispatch]);

  const removeRetailer = useCallback((id: number) => {
    setRetailers(curr => curr.filter(i => i !== id));
  }, []);

  const beginAddRetailers = useCallback(() => {}, []);

  return (
    <View style={styles.container}>
      <AppHeader
        includeTopSafeAreaInset={Platform.OS === 'android'}
        title={t('transactions.filterTitle')}
        left="close"
        right={
          isDefault ? undefined : (
            <Pressable
              hitSlop={15}
              onPress={onClearFilter}
              style={({pressed}) => ({opacity: pressed ? 0.3 : 1})}>
              <Text style={styles.clearButton} variant="bodySmall">
                {t('transactions.clearFilter')}
              </Text>
            </Pressable>
          )
        }
      />
      <View style={styles.content}>
        <View>
          <Text
            style={[styles.label, styles.labelMargin]}
            variant="titleMedium">
            {t('transactions.startDate')}
          </Text>
          <View style={styles.dateRange}>
            <DatePicker value={minStart} onChange={setMinStart}>
              {({onPress, value}) => (
                <Pressable
                  style={({pressed}) => ({opacity: pressed ? 0.3 : 1})}
                  onPress={onPress}>
                  <Text>{t('transactions.from')}</Text>
                  <Text>{value ? formatDate(value) : '-'}</Text>
                </Pressable>
              )}
            </DatePicker>
            <DatePicker value={maxStart} onChange={setMaxStart}>
              {({onPress, value}) => (
                <Pressable
                  style={({pressed}) => ({opacity: pressed ? 0.3 : 1})}
                  onPress={onPress}>
                  <Text>{t('transactions.to')}</Text>
                  <Text>{value ? formatDate(value) : '-'}</Text>
                </Pressable>
              )}
            </DatePicker>
          </View>
          <View style={[styles.labelMargin, styles.labelWithIcon]}>
            <Text style={styles.label} variant="titleMedium">
              {t('transactions.retailers')}
            </Text>

            <IconButton
              icon="plus"
              onPress={beginAddRetailers}
              iconColor="green"
            />
          </View>

          <View style={styles.retailers}>
            {retailers.map(id => (
              <RetailerChip key={id} id={id} onClose={removeRetailer} />
            ))}
          </View>
        </View>
        <Button onPress={applyFilter} disabled={!hasChanged} mode="contained">
          {t('transactions.applyFilter')}
        </Button>
      </View>
    </View>
  );
};
