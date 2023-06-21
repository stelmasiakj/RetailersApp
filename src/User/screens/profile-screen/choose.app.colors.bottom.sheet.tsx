import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {spacing, useDarkModeContext} from '~/designSystem';
import {Portal} from '@gorhom/portal';
import {Divider, List} from 'react-native-paper';
import {BottomSheet} from '~/components';

export const ChooseAppColorsBottomSheet = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const [t] = useTranslation();
  const {isDarkMode, setIsDarkMode} = useDarkModeContext();

  const setLightMode = useCallback(() => {
    onClose();
    setIsDarkMode(false);
  }, [onClose, setIsDarkMode]);

  const setDarkMode = useCallback(() => {
    onClose();
    setIsDarkMode(true);
  }, [onClose, setIsDarkMode]);

  const chosenIcon = useCallback(() => {
    return <List.Icon icon="check" />;
  }, []);

  return (
    <Portal>
      <BottomSheet height={200} isVisible={isVisible} onClose={onClose}>
        <View style={styles.content}>
          <List.Item
            onPress={setLightMode}
            title={t('light')}
            right={!isDarkMode ? chosenIcon : undefined}
          />
          <Divider />
          <List.Item
            onPress={setDarkMode}
            title={t('dark')}
            right={isDarkMode ? chosenIcon : undefined}
          />
        </View>
      </BottomSheet>
    </Portal>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: spacing[32],
  },
});
