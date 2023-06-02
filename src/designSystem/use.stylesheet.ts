import {ImageStyle, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {useMemo} from 'react';
import {spacing} from './spacing';
import {useApplicationTheme} from './use.application.theme';

type TCreateStylesheetFactoryArgs = ReturnType<typeof useApplicationTheme> & {
  spacing: typeof spacing;
};

type TUseStyleSheet = <
  TStyleObj extends {[key: string]: ViewStyle | TextStyle | ImageStyle},
>(
  factory: (args: TCreateStylesheetFactoryArgs) => TStyleObj,
  deps: ReadonlyArray<unknown>,
) => TStyleObj;

export const useStylesheet: TUseStyleSheet = (factory, deps) => {
  const theme = useApplicationTheme();
  return useMemo(() => {
    const stylesDef = factory({...theme, spacing});
    return StyleSheet.create(stylesDef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, theme]);
};
