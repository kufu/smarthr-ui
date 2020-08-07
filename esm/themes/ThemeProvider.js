import * as React from 'react';
import { createTheme } from '../themes/createTheme';
export var ThemeContext = React.createContext(createTheme());
var Provider = ThemeContext.Provider;
export var ThemeProvider = function (_a) {
    var theme = _a.theme, children = _a.children;
    return React.createElement(Provider, { value: theme }, children);
};
//# sourceMappingURL=ThemeProvider.js.map