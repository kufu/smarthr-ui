"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSpacing = void 0;
const useTheme_1 = require("../hooks/useTheme");
const useSpacing = (size) => {
    const { spacing, spacingByChar } = (0, useTheme_1.useTheme)();
    if (typeof size === 'number') {
        return spacingByChar(size);
    }
    else if (typeof size === 'string') {
        return spacing[size];
    }
    else {
        // not going through
        return '0';
    }
};
exports.useSpacing = useSpacing;
//# sourceMappingURL=useSpacing.js.map