"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFontSize = exports.defaultFontSize = exports.defaultHtmlFontSize = void 0;
const lodash_1 = require("../libs/lodash");
exports.defaultHtmlFontSize = 16;
const defaultScaleFactor = 6;
const pxToRem = (htmlFontSize) => (px) => {
    return `${px / htmlFontSize}rem`;
};
const getFontSize = (scaleFactor, diff = 0) => 
// calc(1rem * scaleFactor / (scaleFactor + diff))
`${scaleFactor / (scaleFactor + diff)}rem`;
const getSizes = (scaleFactor) => {
    return {
        XXS: getFontSize(scaleFactor, 3),
        XS: getFontSize(scaleFactor, 2),
        S: getFontSize(scaleFactor, 1),
        M: getFontSize(scaleFactor),
        L: getFontSize(scaleFactor, -1),
        XL: getFontSize(scaleFactor, -2),
        XXL: getFontSize(scaleFactor, -3),
    };
};
exports.defaultFontSize = {
    pxToRem: pxToRem(exports.defaultHtmlFontSize),
    SHORT: 11,
    TALL: 14,
    GRANDE: 18,
    VENTI: 24,
    ...getSizes(defaultScaleFactor),
};
const createFontSize = (userFontSize = {}) => {
    const { htmlFontSize, scaleFactor, ...userTokens } = userFontSize;
    const created = (0, lodash_1.merge)({
        ...exports.defaultFontSize,
        pxToRem: pxToRem(htmlFontSize || exports.defaultHtmlFontSize),
    }, scaleFactor ? getSizes(scaleFactor) : {}, userTokens);
    return created;
};
exports.createFontSize = createFontSize;
//# sourceMappingURL=createFontSize.js.map