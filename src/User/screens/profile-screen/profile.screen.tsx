import {useCallback, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {logoutThunk} from '~/Auth';
import {useAppDispatch} from '~/redux/use.app.dispatch';
import {getProfileThunk} from '../../store';
import {useDarkModeContext, useStylesheet} from '~/designSystem';
import {
  ActivityIndicator,
  Avatar,
  Divider,
  List,
  Text,
} from 'react-native-paper';
import {useProfile} from '../../hooks';
import {AppHeader, ErrorView} from '~/components';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {ChooseAppColorsBottomSheet} from './choose.app.colors.bottom.sheet';
import {useCustomTabbarHeight} from '~/navigationElements';

export const ProfileScreen = () => {
  const {isError, isFetching, profile} = useProfile();
  const dispatch = useAppDispatch();
  const [t] = useTranslation();
  const {isDarkMode} = useDarkModeContext();
  const navigation = useNavigation();
  const [isChooseAppColorsSheetVisible, setIsChooseAppColorsSheetVisible] =
    useState(false);

  const showChooseAppColorsSheetVisible = useCallback(
    () => setIsChooseAppColorsSheetVisible(true),
    [],
  );

  const hideChooseAppColorsSheetVisible = useCallback(
    () => setIsChooseAppColorsSheetVisible(false),
    [],
  );

  const logoutUser = useCallback(() => {
    dispatch(logoutThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);

  const tabbarHeight = useCustomTabbarHeight();

  const styles = useStylesheet(
    ({colors, spacing}) => ({
      container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: spacing[64],
        paddingBottom: spacing[20] + tabbarHeight,
      },
      progress: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      avatar: {
        alignSelf: 'center',
        marginBottom: spacing[16],
      },
      userInfo: {
        marginBottom: spacing[32],
      },
      centeredText: {
        textAlign: 'center',
      },
    }),
    [],
  );

  const avatarText = useMemo(() => {
    return profile
      ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
      : '';
  }, [profile]);

  const onEditProfile = useCallback(() => {
    navigation.navigate('EditProfile');
  }, [navigation]);

  const chevronIcon: NonNullable<
    React.ComponentProps<typeof List.Item>['right']
  > = useCallback(props => <List.Icon {...props} icon="chevron-right" />, []);

  return (
    <>
      <AppHeader title={t('profile.title')} />
      <View style={styles.container}>
        {!profile && isFetching && (
          <View style={styles.progress}>
            <ActivityIndicator />
          </View>
        )}
        {!profile && !isFetching && isError && <ErrorView />}
        {!!profile && (
          <>
            <Avatar.Text style={styles.avatar} size={100} label={avatarText} />
            <Text
              style={[styles.userInfo, styles.centeredText]}
              variant="titleMedium">
              {profile.firstName} {profile.lastName}
              {'\n'}
              <Text style={styles.centeredText} variant="bodySmall">
                {profile.email}
              </Text>
            </Text>
            <List.Item
              onPress={onEditProfile}
              title={t('profile.editProfile')}
              right={chevronIcon}
            />
            <Divider />
            <List.Item
              onPress={showChooseAppColorsSheetVisible}
              title={`${t('profile.colors')}: ${
                isDarkMode ? t('dark') : t('light')
              }`}
              right={chevronIcon}
            />
            <Divider />
            <List.Item
              onPress={logoutUser}
              title={t('profile.logout')}
              right={chevronIcon}
            />
          </>
        )}
        <ChooseAppColorsBottomSheet
          isVisible={isChooseAppColorsSheetVisible}
          onClose={hideChooseAppColorsSheetVisible}
        />
      </View>
    </>
  );
};
