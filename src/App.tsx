import './lang';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {store} from './redux/store';
import {Provider} from 'react-redux';
import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {RootStackNavigator} from './navigation';
import {startMirage} from './server/start.mirage';
import {useAppDispatch} from './redux/use.app.dispatch';
import {initAuthThunk, useAuthState, useAuthorization} from './Auth';
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
  configureFonts,
} from 'react-native-paper';
import {DarkModeContext, IDarkModeContextValues} from './designSystem';
import {PortalProvider} from '@gorhom/portal';
import {CustomTabBarTranslateProvider} from './navigationElements';

startMirage();

const Screens = ({isSignedIn}: {isSignedIn: boolean}) => {
  useAuthorization();

  return (
    <RootStackNavigator initialRouteName={isSignedIn ? 'AppTabs' : 'Login'} />
  );
};

const AppInternal = ({
  theme,
}: {
  theme: NonNullable<React.ComponentProps<typeof NavigationContainer>['theme']>;
}) => {
  const onNavigationReady = useCallback(() => {
    RNBootSplash.hide({fade: true});
  }, []);
  const dispatch = useAppDispatch();
  const authState = useAuthState();

  useEffect(() => {
    dispatch(initAuthThunk());
  }, [dispatch]);

  return (
    <>
      {authState !== 'NOT_DETERMINED' && (
        <NavigationContainer theme={theme} onReady={onNavigationReady}>
          <PortalProvider>
            <Screens isSignedIn={authState === 'SIGNED_IN'} />
          </PortalProvider>
        </NavigationContainer>
      )}
    </>
  );
};

export const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode]);

  const darkModeContextValue = useMemo<IDarkModeContextValues>(
    () => ({
      isDarkMode,
      setIsDarkMode,
    }),
    [isDarkMode],
  );

  return (
    <GestureHandlerRootView style={styles.flexOne}>
      <Provider store={store}>
        <PaperProvider settings={{rippleEffectEnabled: true}} theme={theme}>
          <DarkModeContext.Provider value={darkModeContextValue}>
            <SafeAreaProvider>
              <CustomTabBarTranslateProvider>
                <AppInternal theme={theme} />
                <StatusBar
                  translucent
                  barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                  backgroundColor="transparent"
                />
              </CustomTabBarTranslateProvider>
            </SafeAreaProvider>
          </DarkModeContext.Provider>
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  flexOne: {flex: 1},
} as const);

const getTheme = (isDarkMode: boolean) => {
  const {LightTheme, DarkTheme} = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const fonts = configureFonts({
    config: {
      fontFamily: 'Mulish',
    },
  });

  const lightTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    fonts,
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
    },
  };
  const darkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    fonts,
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
    },
  };

  const theme = isDarkMode ? darkTheme : lightTheme;
  return theme;
};
