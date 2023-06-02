"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPalette = exports.defaultPalette = void 0;
const polished_1 = require("polished");
const lodash_1 = require("../libs/lodash");
/**
 * @deprecated The defaultPelette will be deprecated, please use defaultColor instead
 */
exports.defaultPalette = {
    TEXT_BLACK: '#23221e',
    TEXT_GREY: '#706d65',
    TEXT_DISABLED: '#c1bdb7',
    TEXT_LINK: '#0071c1',
    BORDER: '#d6d3d0',
    ACTION_BACKGROUND: '#d6d3d0',
    BACKGROUND: '#f8f7f6',
    COLUMN: '#f8f7f6',
    OVER_BACKGROUND: '#f2f1f0',
    HEAD: '#edebe8',
    BASE_GREY: '#f5f4f3',
    MAIN: '#0077c7',
    DANGER: '#e01e5a',
    WARNING: '#ff8800',
    SCRIM: (0, polished_1.rgba)('#030302', 0.5),
    OVERLAY: (0, polished_1.rgba)('#030302', 0.15),
    BRAND: '#00c4cc',
};
const createPalette = (userPalette = {}) => {
    const created = (0, lodash_1.merge)({
        hoverColor: (value, darkenAmount = 0.05) => (0, polished_1.darken)(darkenAmount, value),
        disableColor: (value) => (0, polished_1.rgba)(value, 0.5),
        OUTLINE: exports.defaultPalette.MAIN,
        ...exports.defaultPalette,
    }, userPalette, !userPalette.OUTLINE && userPalette.MAIN ? { OUTLINE: userPalette.MAIN } : null);
    return created;
};
exports.createPalette = createPalette;
//# sourceMappingURL=createPalette.js.map