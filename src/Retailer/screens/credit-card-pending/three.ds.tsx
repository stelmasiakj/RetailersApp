import {useTranslation} from 'react-i18next';
import {Button, StyleSheet, Text, View} from 'react-native';

export const ThreeDS = ({onPress}: {onPress: () => void}) => {
  const [t] = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('creditCard.3dsTitle')}</Text>
      <Button
        onPress={onPress}
        title={t('creditCard.continue').toUpperCase()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    alignSelf: 'center',
  },
});
