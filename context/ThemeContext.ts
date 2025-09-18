import { createContext } from 'react';
import { Theme, ThemeContextType } from '../types';

export const ThemeContext = createContext<ThemeContextType>({
  theme: Theme.DARK,
  setTheme: () => console.warn('no theme provider'),
});
