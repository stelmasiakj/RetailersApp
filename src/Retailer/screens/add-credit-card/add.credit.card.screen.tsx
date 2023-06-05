import {useCallback, useMemo, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput as RNTextInput,
  View,
  Linking,
} from 'react-native';
import {AppInputAccessoryView, FormTextField} from '~/components';
import {Button, Text, Switch} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useForm, SubmitHandler, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {
  CreditCardFormState,
  useCreditCardValidationSchema,
} from './use.credit.card.validation.schema';
import {CreditCardView} from './credit.card.view';
import {useCreditCardScreenStyles} from './use.add.credit.card.screen.styles';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import type {RootStackNavigatorParams} from '~/navigation';
import {
  CARD_NUMBER_MASK,
  CV2_MASK,
  EXPIRATION_MASK,
  INPUT_ACCESSORY_ID,
} from './constants';

export const AddCreditCardScreen = () => {
  const validationSchema = useCreditCardValidationSchema();
  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    watch,
  } = useForm<CreditCardFormState>({
    defaultValues: {
      expiration: '',
      cardNumber: '',
      cv2: '',
      regulationsAccepted: false,
    },
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });
  const [t] = useTranslation();
  const navigation =
    useNavigation<StackNavigationProp<RootStackNavigatorParams>>();
  const {
    params: {retailerId},
  } = useRoute<RouteProp<RootStackNavigatorParams, 'AddCreditCard'>>();

  const cardNumberInput = useRef<RNTextInput>(null);
  const expirationInput = useRef<RNTextInput>(null);
  const cv2Input = useRef<RNTextInput>(null);
  const [currentlyFocused, setCurrentlyFocused] =
    useState<keyof CreditCardFormState>();

  const onSubmit: SubmitHandler<CreditCardFormState> = useCallback(
    values => {
      navigation.replace('CreditCardPending', {...values, retailerId});
    },
    [navigation, retailerId],
  );

  const styles = useCreditCardScreenStyles();

  const focusCardNumber = useCallback(() => {
    cardNumberInput.current?.focus();
  }, []);

  const focusExpiration = useCallback(() => {
    expirationInput.current?.focus();
  }, []);

  const focusCV2 = useCallback(() => {
    cv2Input.current?.focus();
  }, []);

  const onNext = useMemo(() => {
    if (currentlyFocused === 'cardNumber') {
      return focusExpiration;
    } else if (currentlyFocused === 'expiration') {
      return focusCV2;
    } else {
      return undefined;
    }
  }, [focusExpiration, focusCV2, currentlyFocused]);

  const onPrev = useMemo(() => {
    if (currentlyFocused === 'expiration') {
      return focusCardNumber;
    } else if (currentlyFocused === 'cv2') {
      return focusExpiration;
    } else {
      return undefined;
    }
  }, [focusCardNumber, focusExpiration, currentlyFocused]);

  const onCreditCardNumberFocus = useCallback(
    () => setCurrentlyFocused('cardNumber'),
    [],
  );

  const onExpirationFocus = useCallback(
    () => setCurrentlyFocused('expiration'),
    [],
  );

  const onCV2Focus = useCallback(() => setCurrentlyFocused('cv2'), []);

  const showRegulations = useCallback(() => {
    Linking.openURL('https://www.google.com');
  }, []);

  const maskCardNumber = useCallback(
    (v: string) => CARD_NUMBER_MASK.mask(v),
    [],
  );

  const maskExpiration = useCallback(
    (v: string) => EXPIRATION_MASK.mask(v),
    [],
  );

  const maskCV2 = useCallback((v: string) => CV2_MASK.mask(v), []);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.flexOne}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.flexOne}
          contentContainerStyle={styles.scrollContent}>
          <CreditCardView
            watch={watch}
            isRotated={currentlyFocused === 'cv2'}
          />
          <FormTextField
            control={control}
            errors={errors}
            name="cardNumber"
            autoComplete="cc-number"
            textContentType="creditCardNumber"
            keyboardType="number-pad"
            label={t('creditCard.cardNumber')}
            returnKeyType="next"
            ref={cardNumberInput}
            onSubmitEditing={focusExpiration}
            inputAccessoryViewID={INPUT_ACCESSORY_ID}
            onFocus={onCreditCardNumberFocus}
            transform={maskCardNumber}
            testID="CreditCardNumber"
          />

          <View style={styles.inputsRow}>
            <View style={styles.inputContainer}>
              <FormTextField
                control={control}
                errors={errors}
                name="expiration"
                label={t('creditCard.expiration')}
                keyboardType="number-pad"
                returnKeyType="next"
                autoComplete="cc-exp"
                onSubmitEditing={focusCV2}
                ref={expirationInput}
                inputAccessoryViewID={INPUT_ACCESSORY_ID}
                onFocus={onExpirationFocus}
                transform={maskExpiration}
                testID="CreditCardExpiration"
              />
            </View>
            <View style={styles.inputContainer}>
              <FormTextField
                control={control}
                errors={errors}
                name="cv2"
                label={t('creditCard.cv2')}
                keyboardType="number-pad"
                returnKeyType="go"
                autoComplete="cc-csc"
                ref={cv2Input}
                inputAccessoryViewID={INPUT_ACCESSORY_ID}
                onFocus={onCV2Focus}
                transform={maskCV2}
                testID="CreditCardCV2"
              />
            </View>
          </View>
          <View style={styles.switchWithLabel}>
            <Text>
              {t('creditCard.acceptRegulations1')}{' '}
              <Text onPress={showRegulations} style={styles.regulationsLink}>
                {t('creditCard.acceptRegulations2')}
              </Text>
            </Text>
            <Controller
              control={control}
              name="regulationsAccepted"
              render={({field: {value, onChange}}) => (
                <Switch
                  testID="AcceptRegulationsSwitch"
                  onValueChange={onChange}
                  value={value}
                />
              )}
            />
          </View>

          <Button
            disabled={!isValid}
            style={styles.submit}
            mode="contained"
            onPress={handleSubmit(onSubmit)}>
            {t('creditCard.saveCreditCard')}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

      <AppInputAccessoryView
        nativeID={INPUT_ACCESSORY_ID}
        onNext={onNext}
        onPrev={onPrev}
      />
    </View>
  );
};
