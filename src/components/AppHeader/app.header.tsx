import {useNavigation} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import {Appbar} from 'react-native-paper';
import {APP_HEADER_HEIGHT} from './app.header.constants';

export const AppHeader = ({
  title,
  includeTopSafeAreaInset = true,
  right,
  left,
}: {
  title: string;
  includeTopSafeAreaInset?: boolean;
  left?: 'back' | 'close' | React.ReactNode;
  right?: React.ReactNode;
}) => {
  const navigation = useNavigation();

  return (
    <Appbar.Header
      statusBarHeight={includeTopSafeAreaInset ? undefined : 0}
      style={styles.header}
      mode="center-aligned"
      elevated>
      {left === 'close' && (
        <Appbar.Action icon={'close'} onPress={navigation.goBack} />
      )}
      {left === 'back' && <Appbar.BackAction onPress={navigation.goBack} />}
      {!!left && typeof left !== 'string' && left}

      <Appbar.Content titleStyle={styles.title} title={title} />

      {!!right && right}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {height: APP_HEADER_HEIGHT},
  title: {fontSize: 16, fontWeight: '700'},
});
