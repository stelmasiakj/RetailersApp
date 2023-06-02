import {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useStylesheet} from '~/designSystem';

export const BottomSheetHandle = memo(
  ({title, onClose}: {title: string; onClose: () => void}) => {
    const [t] = useTranslation();

    const styles = useStylesheet(
      ({colors, spacing}) => ({
        header: {
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: spacing[8],
          height: 40,
        },

        headerItem: {
          width: 100,
          alignItems: 'flex-end',
        },
        closeButton: {
          color: colors.primary,
        },
      }),
      [],
    );

    return (
      <View style={styles.header}>
        <View style={styles.headerItem} />
        <Text variant="bodyMedium">{title || ''}</Text>
        <Pressable
          onPress={onClose}
          style={({pressed}) => [
            styles.headerItem,
            {opacity: pressed ? 0.3 : 1},
          ]}>
          <Text variant="bodySmall" style={styles.closeButton}>
            {t('close')}
          </Text>
        </Pressable>
      </View>
    );
  },
);
