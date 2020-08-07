"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTheme = void 0;
var react_1 = require("react");
var ThemeProvider_1 = require("../themes/ThemeProvider");
exports.useTheme = function () {
    var theme = react_1.useContext(ThemeProvider_1.ThemeContext);
    return theme;
};
//# sourceMappingURL=useTheme.js.map