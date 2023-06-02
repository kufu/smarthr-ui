"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTheme = void 0;
const react_1 = require("react");
const ThemeProvider_1 = require("../themes/ThemeProvider");
const useTheme = () => {
    const theme = (0, react_1.useContext)(ThemeProvider_1.ThemeContext);
    return theme;
};
exports.useTheme = useTheme;
//# sourceMappingURL=useTheme.js.map