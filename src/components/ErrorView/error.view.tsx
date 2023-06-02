import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {useStylesheet} from '~/designSystem';

export const ErrorView = ({title}: {title?: string}) => {
  const [t] = useTranslation();

  const styles = useStylesheet(
    ({colors, spacing}) => ({
      container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: spacing[40],
      },
      title: {
        color: colors.error,
        textAlign: 'center',
      },
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title || t('errors.errorOccured')}</Text>
    </View>
  );
};
