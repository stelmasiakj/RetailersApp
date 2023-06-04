import {memo, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard, StyleSheet, TextInput, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {fonts} from '~/assets';
import {useAppHeaderHeight} from '~/components';
import {useApplicationTheme, useStylesheet} from '~/designSystem';

export const RetailerSearchHeader = memo(
  ({
    isFocused,
    onFocus,
    onBlur,
    search,
    onChangeSearch,
  }: {
    isFocused: boolean;
    onFocus: () => void;
    onBlur: () => void;
    search: string;
    onChangeSearch: (v: string) => void;
  }) => {
    const focusTransition = useSharedValue(isFocused ? 1 : 0);

    useEffect(() => {
      focusTransition.value = withTiming(isFocused ? 1 : 0);
    }, [focusTransition, isFocused]);

    const height = useAppHeaderHeight();
    const styles = useStylesheet(
      ({colors, spacing}) => ({
        container: {
          height,
        },
        background: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.background,
        },
        inputContainer: {
          height: 30,
          position: 'absolute',
          bottom: 10,
          left: spacing[64],
          right: spacing[12],
        },
        input: {
          fontFamily: fonts.Mulish.regular,
          borderColor: 'black',
          height: 30,
          borderWidth: 0,

          fontSize: 16,
          color: colors.onBackground,
        },
        backContainer: {
          position: 'absolute',
          bottom: 0,
          left: 0,
        },
      }),
      [height],
    );
    const input = useRef<TextInput>(null);
    const theme = useApplicationTheme();

    const backgroundAnimatedStyle = useAnimatedStyle(
      () => ({
        opacity: focusTransition.value,
      }),
      [],
    );

    useEffect(() => {
      if (!isFocused) {
        Keyboard.dismiss();
        input.current?.blur();
      }
    }, [isFocused]);

    const [t] = useTranslation();

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.background, backgroundAnimatedStyle]}>
          <View style={styles.backContainer}>
            <Appbar.BackAction onPress={onBlur} />
          </View>
        </Animated.View>

        <View style={styles.inputContainer}>
          <TextInput
            ref={input}
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={
              isFocused ? t('retailer.search') : t('retailer.pressToSearch')
            }
            placeholderTextColor={theme.colors.onBackground}
            onFocus={onFocus}
            onChangeText={onChangeSearch}
            value={search}
          />
        </View>
      </View>
    );
  },
);
