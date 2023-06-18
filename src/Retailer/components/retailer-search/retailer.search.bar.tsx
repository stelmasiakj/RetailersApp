import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  RETAILER_SEARCH_BAR_HEIGHT,
  RETAILER_SEARCH_BAR_MARGIN,
} from './constants';
import {useStylesheet} from '~/designSystem';
import {
  useCustomTabBarTranslate,
  useCustomTabbarHeight,
} from '~/navigationElements';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';
import {IconButton, Text, TouchableRipple} from 'react-native-paper';
import {memo} from 'react';
import {TextInput, View, ViewStyle} from 'react-native';
import {Logo} from '~/components';
import {useTranslation} from 'react-i18next';
import {fonts} from '~/assets';
import {StyleProp} from 'react-native';

export const RetailerSearchBar = memo(
  ({
    openTransition,
    style,
    inputMode,
    onClose,
    onOpen,
    onChangeText,
    value,
  }: {
    openTransition: Animated.SharedValue<number>;
    style: StyleProp<ViewStyle>;
    inputMode: 'input' | 'sudo';
    onOpen: () => void;
    onClose: () => void;
    value: string;
    onChangeText: (v: string) => void;
  }) => {
    const [t] = useTranslation();
    const {top} = useSafeAreaInsets();
    const logoAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: 1 - openTransition.value,
      };
    }, []);

    const closeAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: interpolate(openTransition.value, [0, 1], [0, -20]),
          },
          {
            rotateZ: `${interpolate(
              openTransition.value,
              [0, 1],
              [0, 360],
            )}deg`,
          },
        ],
        opacity: openTransition.value,
      };
    }, []);

    const styles = useStylesheet(
      ({colors, spacing}) => ({
        input: {
          letterSpacing: 0.25,
          lineHeight: 20,
          fontSize: 14,
          fontFamily: fonts.Mulish.regular,
          height: RETAILER_SEARCH_BAR_HEIGHT,
          paddingRight: 0,
          paddingLeft: 0,
          paddingHorizontal: 0,
          color: colors.onBackground,
        },
        inputSudo: {
          color: colors.onBackground,
        },
        wrapper: {
          position: 'absolute',
          top: top + RETAILER_SEARCH_BAR_MARGIN,
          left: RETAILER_SEARCH_BAR_MARGIN,
          right: RETAILER_SEARCH_BAR_MARGIN,
        },
        container: {
          height: RETAILER_SEARCH_BAR_HEIGHT,
          borderRadius: 5,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[16],
          paddingHorizontal: spacing[20],
        },
        close: {
          width: RETAILER_SEARCH_BAR_HEIGHT - 2 * 10,
          height: RETAILER_SEARCH_BAR_HEIGHT - 2 * 10,
          margin: 0,
        },
        closeContainer: {
          position: 'absolute',
          left: 0,
          top: 0,
        },
        inputContainer: {
          height: RETAILER_SEARCH_BAR_HEIGHT,
          justifyContent: 'center',
          flex: 1,
        },
      }),
      [top],
    );

    const tabBarTranslateY = useCustomTabBarTranslate();
    const tabbarHeight = useCustomTabbarHeight();

    const containerAnimatedStyle = useAnimatedStyle(() => {
      if (openTransition.value > 0) {
        return {};
      }
      return {
        opacity: interpolate(tabBarTranslateY.value, [0, tabbarHeight], [1, 0]),
        transform: [
          {
            translateY: interpolate(
              tabBarTranslateY.value,
              [0, tabbarHeight],
              [
                0,
                -(
                  top +
                  RETAILER_SEARCH_BAR_MARGIN +
                  RETAILER_SEARCH_BAR_HEIGHT
                ),
              ],
            ),
          },
        ],
      };
    }, [tabbarHeight, top]);

    return (
      <Animated.View style={[styles.wrapper, containerAnimatedStyle]}>
        <TouchableRipple onPress={onOpen}>
          <Animated.View style={[styles.container, style]}>
            <View>
              <Animated.View style={logoAnimatedStyle}>
                <Logo size={styles.close.height} />
              </Animated.View>
              <Animated.View
                style={[styles.closeContainer, closeAnimatedStyle]}>
                <IconButton
                  onPress={onClose}
                  icon="chevron-left"
                  size={styles.close.height}
                  style={styles.close}
                />
              </Animated.View>
            </View>
            <View style={styles.inputContainer}>
              {inputMode === 'sudo' && (
                <Text style={styles.inputSudo} variant="bodyMedium">
                  {t('retailer.search')}
                </Text>
              )}
              {inputMode === 'input' && (
                <TextInput
                  testID="RetailerSearch"
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  placeholderTextColor={styles.input.color}
                  placeholder={t('retailer.search')}
                  autoFocus
                  value={value}
                  onChangeText={onChangeText}
                />
              )}
            </View>
          </Animated.View>
        </TouchableRipple>
      </Animated.View>
    );
  },
);
