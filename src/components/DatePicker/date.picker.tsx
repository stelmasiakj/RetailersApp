import {useState, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import ModalDatePicker from 'react-native-date-picker';

export const DatePicker = ({
  value,
  onChange,
  children,
}: {
  value: Date | null;
  onChange: (v: Date) => void;
  children: (args: {
    onPress: () => void;
    value: Date | null;
  }) => React.ReactNode;
}) => {
  const [isModalShown, setIsModalShown] = useState(false);
  const [t] = useTranslation();

  const onOpen = useCallback(() => {
    setIsModalShown(true);
  }, []);

  const onClose = useCallback(() => {
    setIsModalShown(false);
  }, []);

  const onConfirm = useCallback(
    (v: Date) => {
      onChange(v);
      onClose();
    },
    [onClose, onChange],
  );

  const onCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <>
      {children({onPress: onOpen, value})}
      <ModalDatePicker
        modal
        locale={'en'}
        is24hourSource="locale"
        mode="date"
        open={isModalShown}
        date={value || new Date()}
        onConfirm={onConfirm}
        onCancel={onCancel}
        // maximumDate={max}
        // minimumDate={min}
        cancelText={t('cancel')}
        confirmText={t('confirm')}
        title={t('selectDate')}
      />
    </>
  );
};
