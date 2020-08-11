import { useContext } from 'react';
import { ThemeContext } from '../themes/ThemeProvider';
export var useTheme = function () {
    var theme = useContext(ThemeContext);
    return theme;
};
//# sourceMappingURL=useTheme.js.map