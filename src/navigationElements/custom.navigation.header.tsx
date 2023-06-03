import {StackHeaderProps} from '@react-navigation/stack';
import {AppHeader} from '~/components';
import {getHeaderTitle} from '@react-navigation/elements';

export const CustomNavigationHeader = ({
  options,
  route,
  back,
}: StackHeaderProps) => {
  const title = getHeaderTitle(options, route.name);

  return (
    <AppHeader
      title={title}
      left={back ? 'back' : undefined}
      right={options.headerRight ? options.headerRight({} as any) : undefined}
    />
  );
};
