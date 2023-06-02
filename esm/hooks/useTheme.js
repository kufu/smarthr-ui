import { useContext } from 'react';
import { ThemeContext } from '../themes/ThemeProvider';
export const useTheme = () => {
    const theme = useContext(ThemeContext);
    return theme;
};
//# sourceMappingURL=useTheme.js.map