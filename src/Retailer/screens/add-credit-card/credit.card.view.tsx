import {memo, useEffect, useState} from 'react';
import {UseFormWatch} from 'react-hook-form';
import {Text} from 'react-native';
import {StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {fonts} from '~/assets';
import {spacing} from '~/designSystem';
import {CreditCardFormState} from './use.credit.card.validation.schema';

const WIDTH = 250;

const HEIGHT = 150;

export const CreditCardView = memo(
  ({
    watch,
    isRotated,
  }: {
    watch: UseFormWatch<CreditCardFormState>;
    isRotated: boolean;
  }) => {
    const rotateAnimation = useSharedValue(isRotated ? 1 : 0);
    const [cv2, setCV2] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiration, setExpiration] = useState('');

    useEffect(() => {
      rotateAnimation.value = withTiming(isRotated ? 1 : 0, {
        duration: 2000,
        easing: Easing.out(Easing.quad),
      });
    }, [isRotated, rotateAnimation]);

    const frontAnimatedStyle = useAnimatedStyle(
      () => ({
        transform: [
          {
            rotateY: `${interpolate(
              rotateAnimation.value,
              [0, 1],
              [0, 180],
            )}deg`,
          },
        ],
      }),
      [],
    );

    const backAnimatedStyle = useAnimatedStyle(
      () => ({
        transform: [
          {
            rotateY: `${interpolate(
              rotateAnimation.value,
              [0, 1],
              [180, 360],
            )}deg`,
          },
        ],
      }),
      [],
    );

    useEffect(() => {
      const subscription = watch(values => {
        setCV2(values.cv2 || '');
        setCardNumber(values.cardNumber || '');
        setExpiration(values.expiration || '');
      });
      return () => subscription.unsubscribe();
    }, [watch]);

    const isVisa = !!cardNumber && cardNumber.startsWith('4');
    const isMasterCard = !!cardNumber && !cardNumber.startsWith('4');

    const cardBrand = isVisa ? 'VISA' : isMasterCard ? 'MASTERCARD' : '';
    const cardBrandStyle = isVisa
      ? styles.cardVisa
      : isMasterCard
      ? styles.cardMastercard
      : undefined;

    return (
      <View style={[styles.container]}>
        <Animated.View style={[styles.card, cardBrandStyle, backAnimatedStyle]}>
          <Text style={[styles.cardText, styles.cardCV2]}>{cv2}</Text>
        </Animated.View>
        <Animated.View
          style={[styles.card, cardBrandStyle, frontAnimatedStyle]}>
          <Text style={[styles.cardText, styles.cardBrand]}>{cardBrand}</Text>
          <Text style={[styles.cardText, styles.cardNumber]}>{cardNumber}</Text>
          <Text style={[styles.cardText, styles.cardExpiration]}>
            {expiration}
          </Text>
        </Animated.View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT,
    alignSelf: 'center',
    marginBottom: spacing[32],
  },
  card: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    backgroundColor: 'grey',
    backfaceVisibility: 'hidden',
  },

  cardVisa: {
    backgroundColor: '#1434CB',
  },
  cardMastercard: {
    backgroundColor: '#FF5F00',
  },

  cardText: {
    color: 'white',
    fontFamily: fonts.Mulish.bold,
    fontSize: 18,
  },
  cardBrand: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  cardNumber: {
    position: 'absolute',
    top: 70,
    left: 15,
  },
  cardExpiration: {
    position: 'absolute',
    top: 100,
    left: 15,
  },
  cardCV2: {
    position: 'absolute',
    top: 60,
    right: 100,
  },
});
