import BottomSheet from '@gorhom/bottom-sheet';
import {useCallback, useEffect, useMemo, useRef} from 'react';
import {BottomSheetHandle} from './bottom.sheet.handle';
import {useTranslation} from 'react-i18next';
import {BottomSheetBackdrop} from './bottom.sheet.backdrop';
import {View} from 'react-native';
import {useDarkModeContext, useStylesheet} from '~/designSystem';
import {Portal} from '@gorhom/portal';
import {Divider, List} from 'react-native-paper';

export const ChooseAppColorsBottomSheet = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const [t] = useTranslation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [300], []);
  const {isDarkMode, setIsDarkMode} = useDarkModeContext();

  const setLightMode = useCallback(() => {
    onClose();
    setIsDarkMode(false);
  }, [onClose, setIsDarkMode]);

  const setDarkMode = useCallback(() => {
    onClose();
    setIsDarkMode(true);
  }, [onClose, setIsDarkMode]);

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  const onChange = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const renderCustomHandle = useCallback(
    () => (
      <BottomSheetHandle title={t('profile.chooseColors')} onClose={onClose} />
    ),
    [t, onClose],
  );

  const styles = useStylesheet(
    ({colors, spacing}) => ({
      background: {
        backgroundColor: colors.background,
        borderRadius: spacing[8],
      },
      content: {
        marginTop: spacing[32],
      },
    }),
    [],
  );

  const chosenIcon = useCallback(() => {
    return <List.Icon icon="check" />;
  }, []);

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        keyboardBlurBehavior="restore"
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={onChange}
        index={-1}
        backdropComponent={BottomSheetBackdrop}
        handleComponent={renderCustomHandle}
        backgroundStyle={styles.background}>
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
