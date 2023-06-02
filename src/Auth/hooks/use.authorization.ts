import {useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAuthState} from './auth.hooks';

export const useAuthorization = () => {
  const navigation = useNavigation();
  const authState = useAuthState();
  const firstCall = useRef(true);

  useEffect(() => {
    if (firstCall.current) {
      firstCall.current = false;
      return;
    }

    if (authState === 'SIGNED_IN' && !firstCall.current) {
      navigation.reset({
        routes: [{name: 'AppTabs'}],
      });
    } else if (authState === 'NOT_SIGNED_IN' && !firstCall.current) {
      navigation.reset({
        routes: [{name: 'Login'}],
      });
    }
  }, [navigation, authState]);
};
