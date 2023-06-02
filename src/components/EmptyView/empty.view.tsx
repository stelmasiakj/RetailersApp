import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {useStylesheet} from '~/designSystem';

export const EmptyView = ({title}: {title: string}) => {
  const styles = useStylesheet(
    ({colors, spacing}) => ({
      container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: spacing[40],
      },
      title: {
        color: colors.onBackground,
        textAlign: 'center',
      },
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};
