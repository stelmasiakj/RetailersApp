import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {addCreditCardThunk} from '~/Retailer/store';
import {useStylesheet} from '~/designSystem';
import type {RootStackNavigatorParams} from '~/navigation';
import {useAppDispatch} from '~/redux/use.app.dispatch';
import {ThreeDS} from './three.ds';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {Face} from './face';
import {Clock} from './clock';
type TScreenState =
  | 'INIT'
  | '3DS'
  | 'WAITING_FOR_CONFIRMATION'
  | 'SUCCESS'
  | 'ERROR';

const IMAGE_WIDTH = 150;

export const CreditCardPendingScreen = () => {
  const {params} =
    useRoute<RouteProp<RootStackNavigatorParams, 'CreditCardPending'>>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [screenState, setScreenState] = useState<TScreenState>('INIT');
  const [t] = useTranslation();

  useEffect(() => {
    const init = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setScreenState('3DS');
    };

    init();
  }, [dispatch, params]);

  const styles = useStylesheet(
    ({colors, spacing}) => ({
      wrapper: {
        flex: 1,
        backgroundColor: colors.background,
      },
      container: {
        flex: 1,
        padding: spacing[20],
        paddingTop: spacing[40],
        justifyContent: 'space-between',
      },
      title: {
        textAlign: 'center',
        marginBottom: spacing[40],
      },
      icon: {width: 100, aspectRatio: 1, alignSelf: 'center'},
    }),
    [],
  );

  const on3DS = useCallback(async () => {
    setScreenState('WAITING_FOR_CONFIRMATION');
    await new Promise(resolve => setTimeout(resolve, 15000));

    try {
      await dispatch(
        addCreditCardThunk({
          cardNumber: params.cardNumber,
          cv2: params.cv2,
          expires: params.expiration,
          ownerId: params.retailerId,
        }),
      ).unwrap();

      setScreenState('SUCCESS');
    } catch {
      setScreenState('ERROR');
    }
  }, [dispatch, params]);

  return (
    <SafeAreaView style={styles.wrapper}>
      {screenState === '3DS' && <ThreeDS onPress={on3DS} />}
      {screenState !== '3DS' && (
        <View style={styles.container}>
          <View>
            <Text variant="headlineLarge" style={styles.title}>
              {
                {
                  INIT: t('creditCard.creditCardInitTitle'),
                  WAITING_FOR_CONFIRMATION: t(
                    'creditCard.waitingForCreditCardConfirm',
                  ),
                  SUCCESS: t('creditCard.cardAdded'),
                  ERROR: t('creditCard.cardAddFailure'),
                }[screenState]
              }
            </Text>

            {screenState === 'INIT' && <ActivityIndicator size={IMAGE_WIDTH} />}
            {screenState !== 'INIT' && (
              <Animated.View
                key={screenState}
                style={styles.icon}
                entering={FadeIn.delay(300).duration(300)}
                exiting={FadeOut.duration(300)}>
                {screenState === 'ERROR' && <Face variant="SAD" color="red" />}
                {screenState === 'SUCCESS' && (
                  <Face variant="HAPPY" color="green" />
                )}
                {screenState === 'WAITING_FOR_CONFIRMATION' && <Clock />}
              </Animated.View>
            )}
          </View>

          {(screenState === 'SUCCESS' || screenState === 'ERROR') && (
            <Button mode="contained" onPress={navigation.goBack}>
              {t('back')}
            </Button>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};
