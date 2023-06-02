import {memo, useCallback} from 'react';
import {Text} from 'react-native-paper';
import {TabView, TabBar} from 'react-native-tab-view';
import {useStylesheet} from '~/designSystem';
import {APP_TABBAR_HEIGHT} from './app.tabbar.constants';

type Props = Parameters<
  NonNullable<React.ComponentProps<typeof TabView>['renderTabBar']>
>[0] &
  React.ComponentProps<typeof TabBar>;

export const AppTabBar = memo((props: Props) => {
  const styles = useStylesheet(
    ({colors}) => ({
      indicator: {
        backgroundColor: colors.primary,
      },
      tab: {height: APP_TABBAR_HEIGHT, minHeight: 0},
      container: {backgroundColor: colors.surface},
    }),
    [],
  );

  const renderLabel: NonNullable<
    React.ComponentProps<typeof TabBar>['renderLabel']
  > = useCallback(({route: {title}}) => {
    return <Text variant="titleSmall">{title}</Text>;
  }, []);

  return (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.container}
      tabStyle={styles.tab}
      renderLabel={renderLabel}
    />
  );
});
