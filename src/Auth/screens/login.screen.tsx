import {useCallback, useMemo, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput as RNTextInput,
} from 'react-native';
import {AppInputAccessoryView, FormTextField, Logo} from '~/components';
import {useAppDispatch} from '~/redux/use.app.dispatch';
import {loginThunk} from '../store';
import {TextInput, Button, Snackbar} from 'react-native-paper';
import {spacing, useStylesheet} from '~/designSystem';
import {SafeAreaView} from 'react-native-safe-area-context';
import {object, string, InferType} from 'yup';
import {useTranslation} from 'react-i18next';
import {useForm, SubmitHandler} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

const useValidationSchema = () => {
  const [t] = useTranslation();

  return object({
    username: string()
      .required(t('validation.required'))
      .email(t('validation.invalidFormat')),
    password: string().required(t('validation.required')),
  });
};

type FormState = InferType<ReturnType<typeof useValidationSchema>>;

const InputAccessoryId = 'LoginInputAccessory';

export const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const validationSchema = useValidationSchema();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormState>({
    defaultValues: {password: '', username: ''},
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });
  const [t] = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const userNameInput = useRef<RNTextInput>(null);
  const passwordInput = useRef<RNTextInput>(null);
  const [currentlyFocused, setCurrentlyFocused] = useState<keyof FormState>();

  const toggleIsPasswordShown = useCallback(
    () => setIsPasswordShown(v => !v),
    [],
  );

  const hideError = useCallback(() => setIsErrorVisible(false), []);

  const onSubmit: SubmitHandler<FormState> = useCallback(
    async values => {
      try {
        setIsSubmitting(true);
        await dispatch(loginThunk(values)).unwrap();
      } catch {
        setIsErrorVisible(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch],
  );

  const styles = useStylesheet(
    ({colors}) => ({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      logo: {
        marginVertical: spacing[64],
        alignSelf: 'center',
      },
      submit: {
        marginTop: spacing[32],
      },
      flexOne: {
        flex: 1,
      },
      scrollContent: {
        paddingHorizontal: spacing[20],
      },
    }),
    [],
  );

  const showPasswordIcon = useMemo(
    () => (
      <TextInput.Icon
        onPress={toggleIsPasswordShown}
        icon={isPasswordShown ? 'eye' : 'eye-off'}
        forceTextInputFocus={false}
      />
    ),
    [toggleIsPasswordShown, isPasswordShown],
  );

  const focusUsername = useCallback(() => {
    userNameInput.current?.focus();
  }, []);

  const focusPassword = useCallback(() => {
    passwordInput.current?.focus();
  }, []);

  const onNext = useMemo(() => {
    if (currentlyFocused === 'username') {
      return focusPassword;
    } else {
      return undefined;
    }
  }, [focusPassword, currentlyFocused]);

  const onPrev = useMemo(() => {
    if (currentlyFocused === 'password') {
      return focusUsername;
    } else {
      return undefined;
    }
  }, [focusUsername, currentlyFocused]);

  const onUsernameFocus = useCallback(
    () => setCurrentlyFocused('username'),
    [],
  );

  const onPasswordFocus = useCallback(
    () => setCurrentlyFocused('password'),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.flexOne}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.flexOne}
          contentContainerStyle={styles.scrollContent}>
          <Logo size={150} style={styles.logo} />
          <FormTextField
            control={control}
            errors={errors}
            name="username"
            autoComplete="username"
            textContentType="username"
            keyboardType="email-address"
            autoCapitalize="none"
            label={t('login.username')}
            returnKeyType="next"
            ref={userNameInput}
            onSubmitEditing={focusPassword}
            inputAccessoryViewID={InputAccessoryId}
            onFocus={onUsernameFocus}
          />

          <FormTextField
            control={control}
            errors={errors}
            name="password"
            label={t('login.password')}
            returnKeyType="done"
            autoComplete="password"
            textContentType="password"
            secureTextEntry={!isPasswordShown}
            right={showPasswordIcon}
            ref={passwordInput}
            inputAccessoryViewID={InputAccessoryId}
            onFocus={onPasswordFocus}
          />

          <Button
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submit}
            mode="contained"
            onPress={handleSubmit(onSubmit)}>
            {t('login.signin')}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
      <Snackbar visible={isErrorVisible} onDismiss={hideError}>
        {t('errors.errorOccured')}
      </Snackbar>
      <AppInputAccessoryView
        nativeID={InputAccessoryId}
        onNext={onNext}
        onPrev={onPrev}
      />
    </SafeAreaView>
  );
};
