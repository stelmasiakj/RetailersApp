import GorhomBottomSheet from '@gorhom/bottom-sheet';
import {useCallback, useEffect, useMemo, useRef} from 'react';
import {BottomSheetHandle} from './bottom.sheet.handle';
import {BottomSheetBackdrop} from './bottom.sheet.backdrop';
import {useStylesheet} from '~/designSystem';
import {Portal} from '@gorhom/portal';

export const BottomSheet = ({
  isVisible,
  onClose,
  height = 300,
  children,
}: {
  isVisible: boolean;
  onClose: () => void;
  height?: number;
  children?: React.ReactNode;
}) => {
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);
  const snapPoints = useMemo(() => [height], [height]);

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

  const renderCustomHandle = useCallback(() => <BottomSheetHandle />, []);

  const styles = useStylesheet(
    ({colors, spacing}) => ({
      background: {
        backgroundColor: colors.background,
        borderRadius: spacing[16],
      },
    }),
    [],
  );

  const renderBackDrop: NonNullable<
    React.ComponentProps<typeof GorhomBottomSheet>['backdropComponent']
  > = useCallback(
    props => <BottomSheetBackdrop {...props} onPress={onClose} />,
    [onClose],
  );

  return (
    <Portal>
      <GorhomBottomSheet
        ref={bottomSheetRef}
        keyboardBlurBehavior="restore"
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={onChange}
        index={-1}
        backdropComponent={renderBackDrop}
        handleComponent={renderCustomHandle}
        backgroundStyle={styles.background}>
        {children}
      </GorhomBottomSheet>
    </Portal>
  );
};
