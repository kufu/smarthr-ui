"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSize = exports.defaultSize = void 0;
var lodash_1 = require("../libs/lodash");
var defaultHtmlFontSize = 16;
var defaultSpaceSize = 8;
var pxToRem = function (value) { return function (font) {
    return value / font + "rem";
}; };
var getSpace = function (size) {
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
var defaultFontSize = { SHORT: 11, TALL: 14, GRANDE: 18, VENTI: 24 };
var defaultMediaQuery = { SP: 599, TABLET: 959 };
var defaultSpace = getSpace(defaultSpaceSize);
exports.defaultSize = {
    pxToRem: function (value) { return pxToRem(value)(defaultHtmlFontSize); },
    font: defaultFontSize,
    space: defaultSpace,
    mediaQuery: defaultMediaQuery,
};
exports.createSize = function (userSize) {
    if (userSize === void 0) { userSize = {}; }
    var space = userSize.space || {};
    var XXS = space.defaultRem || defaultSpaceSize;
    var created = lodash_1.merge({
        pxToRem: function (value) { return pxToRem(value)(userSize.htmlFontSize || defaultHtmlFontSize); },
        space: getSpace(XXS),
        font: defaultFontSize,
        mediaQuery: defaultMediaQuery,
    }, userSize);
    return created;
};
//# sourceMappingURL=createSize.js.map