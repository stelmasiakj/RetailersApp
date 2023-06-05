import {
  Keyboard,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  TextInput as RNTextInput,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useProfile} from '../hooks';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {object, string, InferType} from 'yup';
import {useAppDispatch} from '~/redux/use.app.dispatch';
import {yupResolver} from '@hookform/resolvers/yup';
import {useStylesheet} from '~/designSystem';
import {Button} from 'react-native-paper';
import {useCallback, useMemo, useRef, useState} from 'react';
import {updateProfileThunk} from '../store';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {AppHeader, AppInputAccessoryView, FormTextField} from '~/components';

const useValidationSchema = () => {
  const [t] = useTranslation();

  return object({
    email: string()
      .required(t('validation.required'))
      .email(t('validation.invalidFormat')),
    firstName: string().required(t('validation.required')),
    lastName: string().required(t('validation.required')),
  });
};

type FormState = InferType<ReturnType<typeof useValidationSchema>>;

const InputAccessoryId = 'EditProfileInputAccessory';

export const EditProfileScreen = () => {
  const [t] = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const validationSchema = useValidationSchema();
  const profile = useProfile().profile!;
  const {
    control,
    handleSubmit,

    formState: {errors, isSubmitting},
  } = useForm<FormState>({
    defaultValues: profile,
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });
  const [height, setHeight] = useState(0);
  const firstNameInput = useRef<RNTextInput>(null);
  const lastNameInput = useRef<RNTextInput>(null);
  const emailInput = useRef<RNTextInput>(null);
  const [currentlyFocused, setCurrentlyFocused] = useState<keyof FormState>();

  const onSubmit: SubmitHandler<FormState> = useCallback(
    async values => {
      try {
        await dispatch(updateProfileThunk(values)).unwrap();
        navigation.goBack();
      } catch {}
    },
    [dispatch, navigation],
  );
  const {bottom} = useSafeAreaInsets();

  const styles = useStylesheet(
    ({colors, spacing}) => ({
      wrapper: {
        flex: 1,
        backgroundColor: colors.background,
      },
      container: {
        flex: 1,
      },
      content: {
        flex: 1,
        padding: spacing[20],
        paddingBottom: Math.max(spacing[20], bottom),
      },
      separator: {
        minHeight: spacing[20],
        flex: 1,
      },
    }),
    [bottom],
  );

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setHeight(e.nativeEvent.layout.height);
  }, []);

  const {height: screenHeight} = useWindowDimensions();

  const focusFirstName = useCallback(() => {
    firstNameInput.current?.focus();
  }, []);

  const focusLastName = useCallback(() => {
    lastNameInput.current?.focus();
  }, []);

  const focusEmail = useCallback(() => {
    emailInput.current?.focus();
  }, []);

  const onNext = useMemo(() => {
    if (currentlyFocused === 'firstName') {
      return focusLastName;
    } else if (currentlyFocused === 'lastName') {
      return focusEmail;
    } else {
      return undefined;
    }
  }, [currentlyFocused, focusLastName, focusEmail]);

  const onPrev = useMemo(() => {
    if (currentlyFocused === 'lastName') {
      return focusFirstName;
    } else if (currentlyFocused === 'email') {
      return focusLastName;
    } else {
      return undefined;
    }
  }, [currentlyFocused, focusFirstName, focusLastName]);

  const onFirsNameFocus = useCallback(
    () => setCurrentlyFocused('firstName'),
    [],
  );

  const onLastNameFocus = useCallback(
    () => setCurrentlyFocused('lastName'),
    [],
  );

  const onEmailFocus = useCallback(() => setCurrentlyFocused('email'), []);

  return (
    <View onLayout={onLayout} style={styles.wrapper}>
      <AppHeader
        left="close"
        title={t('profile.editProfile')}
        includeTopSafeAreaInset={Platform.OS === 'android'}
      />
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
        keyboardVerticalOffset={screenHeight - height}>
        <View style={styles.content} pointerEvents="box-none">
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={Keyboard.dismiss}
          />
          <FormTextField
            control={control}
            errors={errors}
            name="firstName"
            textContentType="givenName"
            autoComplete="name-given"
            label={t('profile.firstName')}
            returnKeyType="next"
            ref={firstNameInput}
            onSubmitEditing={focusLastName}
            onFocus={onFirsNameFocus}
            inputAccessoryViewID={InputAccessoryId}
            testID="ProfileFirstName"
          />
          <FormTextField
            control={control}
            errors={errors}
            name="lastName"
            textContentType="familyName"
            autoComplete="name-family"
            label={t('profile.lastName')}
            returnKeyType="next"
            ref={lastNameInput}
            onSubmitEditing={focusEmail}
            onFocus={onLastNameFocus}
            inputAccessoryViewID={InputAccessoryId}
            testID="ProfileLastName"
          />
          <FormTextField
            control={control}
            errors={errors}
            name="email"
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
            autoComplete="email"
            label={t('profile.email')}
            returnKeyType="done"
            ref={emailInput}
            onFocus={onEmailFocus}
            inputAccessoryViewID={InputAccessoryId}
            testID="ProfileEmail"
          />
          <View style={styles.separator} pointerEvents="box-none" />
          <Button
            loading={isSubmitting}
            disabled={isSubmitting}
            mode="contained"
            onPress={handleSubmit(onSubmit)}>
            {t('save')}
          </Button>
        </View>
      </KeyboardAvoidingView>
      <AppInputAccessoryView
        nativeID={InputAccessoryId}
        onNext={onNext}
        onPrev={onPrev}
      />
    </View>
  );
};
