import {memo, useCallback} from 'react';
import {Chip} from 'react-native-paper';
import {useRetailerListItem} from '~/Retailer/hooks/retailer.hooks';

export const RetailerChip = memo(
  ({id, onClose}: {id: number; onClose: (id: number) => void}) => {
    const retailer = useRetailerListItem(id);

    const onClosePressed = useCallback(() => {
      onClose(id);
    }, [id, onClose]);

    if (!retailer) {
      return null;
    }

    return (
      <Chip elevated icon="account" onClose={onClosePressed}>
        {retailer.firstName} {retailer.lastName}
      </Chip>
    );
  },
);
