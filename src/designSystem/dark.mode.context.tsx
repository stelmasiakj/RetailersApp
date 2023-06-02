import {createContext, useContext} from 'react';

export interface IDarkModeContextValues {
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
}

export const DarkModeContext = createContext<IDarkModeContextValues>({} as any);

export const useDarkModeContext = () => {
  return useContext(DarkModeContext);
};
