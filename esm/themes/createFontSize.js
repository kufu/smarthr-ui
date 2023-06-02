import { merge } from '../libs/lodash';
export const defaultHtmlFontSize = 16;
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
export const defaultFontSize = {
    pxToRem: pxToRem(defaultHtmlFontSize),
    SHORT: 11,
    TALL: 14,
    GRANDE: 18,
    VENTI: 24,
    ...getSizes(defaultScaleFactor),
};
export const createFontSize = (userFontSize = {}) => {
    const { htmlFontSize, scaleFactor, ...userTokens } = userFontSize;
    const created = merge({
        ...defaultFontSize,
        pxToRem: pxToRem(htmlFontSize || defaultHtmlFontSize),
    }, scaleFactor ? getSizes(scaleFactor) : {}, userTokens);
    return created;
};
//# sourceMappingURL=createFontSize.js.map