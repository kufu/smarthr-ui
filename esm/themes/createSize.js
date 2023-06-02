import { merge } from '../libs/lodash';
const defaultHtmlFontSize = 16;
const defaultSpaceSize = 8;
const pxToRem = (value) => (font) => {
    return `${value / font}rem`;
};
const getSpace = (size) => {
    return {
        XXS: size,
        XS: size * 2,
        S: size * 3,
        M: size * 4,
        L: size * 5,
        XL: size * 6,
        XXL: size * 7,
    };
};
const defaultFontSize = { SHORT: 11, TALL: 14, GRANDE: 18, VENTI: 24 };
const defaultMediaQuery = { SP: 599, TABLET: 959 };
const defaultSpace = getSpace(defaultSpaceSize);
/**
 * @deprecated The defaultSize will be deprecated, please use defaultFontSize, defaultSpacing or defaultBreakPoint instead
 */
export const defaultSize = {
    pxToRem: (value) => pxToRem(value)(defaultHtmlFontSize),
    font: defaultFontSize,
    space: defaultSpace,
    mediaQuery: defaultMediaQuery,
};
export const createSize = (userSize = {}) => {
    const space = userSize.space || {};
    const XXS = space.defaultRem || defaultSpaceSize;
    const created = merge({
        pxToRem: (value) => pxToRem(value)(userSize.htmlFontSize || defaultHtmlFontSize),
        space: getSpace(XXS),
        font: { ...defaultFontSize },
        mediaQuery: { ...defaultMediaQuery },
    }, userSize);
    return created;
};
//# sourceMappingURL=createSize.js.map