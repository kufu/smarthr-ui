"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createColor = exports.defaultColor = void 0;
const polished_1 = require("polished");
const lodash_1 = require("../libs/lodash");
const BLACK = '#030302'; // hwb(56, 17, 1)
const greyScale = {
    GREY_5: '#f8f7f6',
    GREY_6: '#f5f4f3',
    GREY_7: '#f2f1f0',
    GREY_9: '#edebe8',
    GREY_20: '#d6d3d0',
    GREY_30: '#c1bdb7',
    GREY_65: '#706d65',
    GREY_100: '#23221e', // hwb(52, 15, 14)
};
const transparencyScale = {
    TRANSPARENCY_15: (0, polished_1.rgba)(BLACK, 0.15),
    TRANSPARENCY_30: (0, polished_1.rgba)(BLACK, 0.3),
    TRANSPARENCY_50: (0, polished_1.rgba)(BLACK, 0.5),
};
const primitiveTokens = {
    WHITE: '#fff',
    BLUE_100: '#0077c7',
    BLUE_101: '#0071c1',
    RED_100: '#e01e5a',
    ORANGE_100: '#ff8800',
    YELLOW_100: '#ffcc17',
    SMARTHR_BLUE: '#00c4cc',
};
const semanticTokens = {
    TEXT_BLACK: greyScale.GREY_100,
    TEXT_WHITE: primitiveTokens.WHITE,
    TEXT_GREY: greyScale.GREY_65,
    TEXT_DISABLED: greyScale.GREY_30,
    TEXT_LINK: primitiveTokens.BLUE_101,
    WHITE: primitiveTokens.WHITE,
    BACKGROUND: greyScale.GREY_5,
    COLUMN: greyScale.GREY_5,
    BASE_GREY: greyScale.GREY_6,
    OVER_BACKGROUND: greyScale.GREY_7,
    HEAD: greyScale.GREY_9,
    BORDER: greyScale.GREY_20,
    ACTION_BACKGROUND: greyScale.GREY_20,
    MAIN: primitiveTokens.BLUE_100,
    OUTLINE: primitiveTokens.BLUE_100,
    DANGER: primitiveTokens.RED_100,
    WARNING: primitiveTokens.ORANGE_100,
    WARNING_YELLOW: primitiveTokens.YELLOW_100,
    OVERLAY: transparencyScale.TRANSPARENCY_15,
    SCRIM: transparencyScale.TRANSPARENCY_50,
    BRAND: primitiveTokens.SMARTHR_BLUE,
};
exports.defaultColor = { ...semanticTokens, ...greyScale, ...transparencyScale };
const createColor = (userColor = {}) => {
    const created = (0, lodash_1.merge)({
        hoverColor: (value, darkenAmount = 0.05) => (0, polished_1.darken)(darkenAmount, value),
        disableColor: (value) => (0, polished_1.rgba)(value, 0.5),
        ...exports.defaultColor,
    }, userColor, !userColor.OUTLINE && userColor.MAIN ? { OUTLINE: (0, polished_1.transparentize)(0.5, userColor.MAIN) } : null);
    return created;
};
exports.createColor = createColor;
//# sourceMappingURL=createColor.js.map