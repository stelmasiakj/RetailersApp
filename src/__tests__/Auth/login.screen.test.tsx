import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {LoginScreen} from '~/Auth';
import {apiClient} from '~/api';
import {makeStore} from '~/redux/store';
import {getAllGenericPasswordServices} from 'react-native-keychain';
import {tokenStorage} from '~/Auth/storage';

describe('login screen tests', () => {
  beforeEach(() => {
    render(
      <Provider store={makeStore()}>
        <LoginScreen />
      </Provider>,
    );
  });

  it('successful login should call login endpoint', async () => {
    const loginSpy = jest
      .spyOn(apiClient, 'login')
      .mockResolvedValue({token: 'testToken'});
    (getAllGenericPasswordServices as jest.Mock).mockResolvedValueOnce([]);
    const username = 'test@mail.com';
    const password = 'password';

    fireEvent.changeText(screen.getByTestId('UserNameInput'), username);
    fireEvent.changeText(screen.getByTestId('PasswordInput'), password);
    fireEvent.press(screen.getByTestId('LoginSubmitButton'));

    await waitFor(() => {
      expect(loginSpy).toHaveBeenCalledTimes(1);
      expect(loginSpy).toHaveBeenCalledWith({username, password});
    });
  });

  it('successful login should write token to secure storage', async () => {
    const username = 'test@mail.com';
    const password = 'password';
    const token = 'testToken';
    jest.spyOn(apiClient, 'login').mockResolvedValue({token});
    const writeTokenSpy = jest
      .spyOn(tokenStorage, 'write')
      .mockImplementation(() => Promise.resolve());

    fireEvent.changeText(screen.getByTestId('UserNameInput'), username);
    fireEvent.changeText(screen.getByTestId('PasswordInput'), password);
    fireEvent.press(screen.getByTestId('LoginSubmitButton'));

    await waitFor(() => {
      expect(writeTokenSpy).toHaveBeenCalledTimes(1);
      expect(writeTokenSpy).toHaveBeenCalledWith(token);
    });
  });

  it('should show error message if user typed invalid email', async () => {
    const username = 'test';
    const password = 'password';

    fireEvent.changeText(screen.getByTestId('UserNameInput'), username);
    fireEvent.changeText(screen.getByTestId('PasswordInput'), password);
    fireEvent.press(screen.getByTestId('LoginSubmitButton'));

    await waitFor(() => {
      expect(screen.getByTestId('UserNameInput_Message')).toHaveTextContent(
        'validation.invalidFormat',
      );
    });
  });

  it('should show error message if user typed no email', async () => {
    const username = '';
    const password = 'password';

    fireEvent.changeText(screen.getByTestId('UserNameInput'), username);
    fireEvent.changeText(screen.getByTestId('PasswordInput'), password);
    fireEvent.press(screen.getByTestId('LoginSubmitButton'));

    await waitFor(() => {
      expect(screen.getByTestId('UserNameInput_Message')).toHaveTextContent(
        'validation.required',
      );
    });
  });

  it('should show error message if user typed no password', async () => {
    const username = 'test@gmail.com';
    const password = '';

    fireEvent.changeText(screen.getByTestId('UserNameInput'), username);
    fireEvent.changeText(screen.getByTestId('PasswordInput'), password);
    fireEvent.press(screen.getByTestId('LoginSubmitButton'));

    await waitFor(() => {
      expect(screen.getByTestId('PasswordInput_Message')).toHaveTextContent(
        'validation.required',
      );
    });
  });

  it('should show error snackbar when login failed', async () => {
    const username = 'test@mail.com';
    const password = 'password';
    jest.spyOn(apiClient, 'login').mockRejectedValueOnce({});

    fireEvent.changeText(screen.getByTestId('UserNameInput'), username);
    fireEvent.changeText(screen.getByTestId('PasswordInput'), password);
    fireEvent.press(screen.getByTestId('LoginSubmitButton'));

    await waitFor(() => {
      expect(screen.getByTestId('LoginScreenErrorSnackbar')).toBeVisible();
    });
  });
});
