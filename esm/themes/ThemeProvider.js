import * as React from 'react';
import { createTheme } from '../themes/createTheme';
export const ThemeContext = React.createContext(createTheme());
const { Provider } = ThemeContext;
export const ThemeProvider = ({ theme, children }) => {
    return React.createElement(Provider, { value: theme }, children);
};
//# sourceMappingURL=ThemeProvider.js.map