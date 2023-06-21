import {memo, useCallback, useMemo, useState} from 'react';
import {Alert, StyleSheet, View, useWindowDimensions} from 'react-native';
import {List, Divider, Dialog, Button, Text} from 'react-native-paper';
import React from 'react';
import {CreditCardListItem} from '~/domain';
import Animated, {
  Layout,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Portal} from '@gorhom/portal';
import {useTranslation} from 'react-i18next';
import {deleteCreditCardThunk} from '~/Retailer/store';
import {useAppDispatch} from '~/redux/use.app.dispatch';
import {useRetailerId} from '../use.retailer.id';
import {spacing, useApplicationTheme, useStylesheet} from '~/designSystem';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {OptionsBottomSheet} from '~/components/OptionsBottomSheet/options.bottom.sheet';

const HEIGHT = 67;

const PAN_DELETE_TRESHOLD = 150;

export const CreditCardItem = memo(
  ({
    card: {lastFourDigits, expires, id},
    isLast,
  }: {
    card: CreditCardListItem;
    isLast: boolean;
  }) => {
    const [t] = useTranslation();
    const left: NonNullable<React.ComponentProps<typeof List.Item>['left']> =
      useCallback(
        props => <List.Icon {...props} icon="credit-card-outline" />,
        [],
      );
    const panX = useSharedValue(0);
    const startPanX = useSharedValue(0);
    const isPressedIn = useSharedValue(0);
    const [isHiddenTemporarily, setIsHiddenTemporarily] = useState(false);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
    const dispatch = useAppDispatch();
    const retailerId = useRetailerId();
    const {
      colors: {
        background,
        elevation: {level2},
      },
    } = useApplicationTheme();
    const [isOptionsBottomSheetVisible, setIsOptionsBottomSheetVisible] =
      useState(false);

    const hideOptionsBottomSheet = useCallback(
      () => setIsOptionsBottomSheetVisible(false),
      [],
    );

    const showOptionsBottomSheet = useCallback(() => {
      ReactNativeHapticFeedback.trigger('impactHeavy');
      setIsOptionsBottomSheetVisible(true);
    }, []);

    const options = useMemo(
      () => [{id: 'DELETE', label: t('delete'), icon: 'delete'}],
      [t],
    );

    const showDeleteDialog = useCallback(
      () => setIsDeleteDialogVisible(true),
      [],
    );

    const hideDeleteDialog = useCallback(
      () => setIsDeleteDialogVisible(false),
      [],
    );

    const {width: screenWidth} = useWindowDimensions();

    const hideTemporarily = useCallback(() => setIsHiddenTemporarily(true), []);
    const restoreHiddenTemporarily = useCallback(() => {
      panX.value = 0;
      setIsHiddenTemporarily(false);
    }, [panX]);

    const deleteCreditCard = useCallback(async () => {
      hideDeleteDialog();
      try {
        await dispatch(deleteCreditCardThunk({id, retailerId})).unwrap();
      } catch {
        Alert.alert(t('errors.errorOccured'));
        restoreHiddenTemporarily();
      }
    }, [
      dispatch,
      id,
      retailerId,
      restoreHiddenTemporarily,
      hideDeleteDialog,
      t,
    ]);

    const onDeleteCancelled = useCallback(() => {
      hideDeleteDialog();
      restoreHiddenTemporarily();
    }, [hideDeleteDialog, restoreHiddenTemporarily]);

    const onDeleteRequested = useCallback(() => {
      showDeleteDialog();
      hideTemporarily();
      hideOptionsBottomSheet();
    }, [showDeleteDialog, hideTemporarily, hideOptionsBottomSheet]);

    const panGesture = Gesture.Pan()
      .onStart(() => {
        startPanX.value = panX.value;
      })
      .onUpdate(e => {
        panX.value = Math.min(startPanX.value + e.translationX, 0);
      })
      .onEnd(() => {
        if (panX.value < -PAN_DELETE_TRESHOLD) {
          panX.value = withTiming(-screenWidth, undefined, done => {
            if (done) {
              runOnJS(onDeleteRequested)();
            }
          });
        } else {
          panX.value = withTiming(0);
        }
      });

    const longPressGesture = Gesture.LongPress()
      .minDuration(1000)
      .onStart(() => {})
      .onBegin(() => {
        isPressedIn.value = withTiming(1);
      })
      .onStart(() => {
        runOnJS(showOptionsBottomSheet)();
      })
      .onFinalize(() => {
        isPressedIn.value = withTiming(0);
      });

    const cardAnimatedStyle = useAnimatedStyle(
      () => ({
        transform: [{translateX: panX.value}],
        backgroundColor: interpolateColor(
          isPressedIn.value,
          [0, 1],
          [background, level2],
        ),
      }),
      [level2, background],
    );

    const iconAnimatedStyle = useAnimatedStyle(
      () => ({
        transform: [
          {
            scale: withTiming(panX.value < -PAN_DELETE_TRESHOLD ? 1 : 0.5),
          },
        ],
      }),
      [],
    );

    const playHapticFeedback = useCallback(() => {
      ReactNativeHapticFeedback.trigger('impactMedium');
    }, []);

    useAnimatedReaction(
      () => panX.value,
      (curr, prev) => {
        if (
          curr < -PAN_DELETE_TRESHOLD &&
          (prev || 0) >= -PAN_DELETE_TRESHOLD
        ) {
          runOnJS(playHapticFeedback)();
        }
      },
      [playHapticFeedback],
    );

    const styles = useStylesheet(
      ({colors}) => ({
        card: {
          height: HEIGHT,
          backgroundColor: colors.background,
        },
        modalTitle: {textAlign: 'center'},
        delete: {
          backgroundColor: 'green',
          paddingRight: spacing[16],
          justifyContent: 'center',
          alignItems: 'flex-end',
        },
      }),
      [],
    );
    const theme = useApplicationTheme();
    const wrapperStyle = useMemo(
      () => ({height: isHiddenTemporarily ? 0 : 'auto'}),
      [isHiddenTemporarily],
    );

    return (
      <>
        <Animated.View
          layout={Layout.springify()}
          style={wrapperStyle}
          testID={`CreditCardItem_${id}`}>
          <View style={[StyleSheet.absoluteFill, styles.delete]}>
            <Animated.View style={iconAnimatedStyle}>
              <Icon size={40} color="white" name="delete" />
            </Animated.View>
          </View>
          <GestureDetector gesture={Gesture.Race(panGesture, longPressGesture)}>
            <Animated.View style={[styles.card, cardAnimatedStyle]}>
              <List.Item
                left={left}
                title={`•••• •••• •••• ${lastFourDigits}`}
                description={expires}
              />
              {!isLast && <Divider />}
            </Animated.View>
          </GestureDetector>
        </Animated.View>
        <Portal>
          <Dialog onDismiss={hideDeleteDialog} visible={isDeleteDialogVisible}>
            <Dialog.Icon icon="alert" />
            <Dialog.Title style={styles.modalTitle}>
              {t('creditCard.deleteTitle')}
            </Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">{t('creditCard.deleteQuestion')}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={onDeleteCancelled}
                textColor={theme.colors.error}>
                {t('cancel')}
              </Button>
              <Button onPress={deleteCreditCard}>{t('confirm')}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <OptionsBottomSheet
          isVisible={isOptionsBottomSheetVisible}
          onClose={hideOptionsBottomSheet}
          onOptionPress={onDeleteRequested}
          options={options}
        />
      </>
    );
  },
);
