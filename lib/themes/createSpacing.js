"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSpacing = exports.createSpacingByChar = exports.createSpacing = exports.defaultBaseSize = void 0;
const createFontSize_1 = require("./createFontSize");
exports.defaultBaseSize = createFontSize_1.defaultHtmlFontSize / 2;
const primitiveTokens = [
    0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 8, -0.25, -0.5, -0.75, -1, -1.25, -1.5, -2,
    -2.5, -3, -3.5, -4, -8,
];
const getSpacing = (baseSize) => {
    const spacingByChar = (0, exports.createSpacingByChar)(baseSize);
    return {
        X3S: spacingByChar(0.25),
        XXS: spacingByChar(0.5),
        XS: spacingByChar(1),
        S: spacingByChar(1.5),
        M: spacingByChar(2),
        L: spacingByChar(2.5),
        XL: spacingByChar(3),
        XXL: spacingByChar(3.5),
        X3L: spacingByChar(4),
        NONE: spacingByChar(0),
    };
};
const getSpacingByChar = (baseSize) => {
    const charSize = baseSize * 2;
    return primitiveTokens
        .map((size) => {
        const value = !size ? '0' : `${charSize * size}px`;
        return { [size]: value };
    })
        .reduce((a, c) => Object.assign(a, c), {});
};
const createSpacing = (userBaseSize = exports.defaultBaseSize) => getSpacing(userBaseSize);
exports.createSpacing = createSpacing;
const createSpacingByChar = (userBaseSize = exports.defaultBaseSize) => (size) => getSpacingByChar(userBaseSize)[size];
exports.createSpacingByChar = createSpacingByChar;
exports.defaultSpacing = (0, exports.createSpacing)();
//# sourceMappingURL=createSpacing.js.map