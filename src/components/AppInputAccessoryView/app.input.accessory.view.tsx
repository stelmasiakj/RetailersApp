import {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import {useApplicationTheme, useStylesheet} from '~/designSystem';

export const AppInputAccessoryView = memo(
  ({
    nativeID,
    onNext,
    onPrev,
  }: {
    nativeID: string;
    onNext: (() => void) | undefined;
    onPrev: (() => void) | undefined;
  }) => {
    const [t] = useTranslation();
    const styles = useStylesheet(
      ({colors, spacing}) => ({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 40,
          paddingHorizontal: spacing[20],
          backgroundColor: colors.surface,
          borderTopColor: colors.onSurface,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        buttons: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        done: {
          color: colors.onSurface,
        },
      }),
      [],
    );
    const theme = useApplicationTheme();

    if (Platform.OS === 'android') {
      return null;
    }

    return (
      <InputAccessoryView nativeID={nativeID}>
        <View style={styles.container}>
          <View style={styles.buttons}>
            <IconButton
              icon="chevron-up"
              iconColor={theme.colors.onSurface}
              size={20}
              disabled={!onPrev}
              onPress={onPrev}
            />
            <IconButton
              icon="chevron-down"
              iconColor={theme.colors.onSurface}
              size={20}
              disabled={!onNext}
              onPress={onNext}
            />
          </View>
          <Pressable hitSlop={20} onPress={Keyboard.dismiss}>
            <Text style={styles.done} variant="labelMedium">
              {t('done')}
            </Text>
          </Pressable>
        </View>
      </InputAccessoryView>
    );
  },
);
