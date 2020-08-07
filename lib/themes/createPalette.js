"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPalette = exports.defaultPalette = void 0;
var lodash_1 = require("../libs/lodash");
var polished_1 = require("polished");
exports.defaultPalette = {
    TEXT_BLACK: '#333',
    TEXT_GREY: '#767676',
    TEXT_DISABLED: '#c1c1c1',
    TEXT_LINK: '#007bc2',
    BORDER: '#d6d6d6',
    BACKGROUND: '#f5f6fa',
    COLUMN: '#f9f9f9',
    MAIN: '#00a5ab',
    DANGER: '#ef475b',
    WARNING: '#ff8800',
    SCRIM: 'rgba(0,0,0,0.5)',
    OVERLAY: 'rgba(0,0,0,0.15)',
    HEADER_GREEN: '#57d0d5',
    BRAND: '#00c4cc',
};
exports.createPalette = function (userPalette) {
    if (userPalette === void 0) { userPalette = {}; }
    var created = lodash_1.merge(__assign({ hoverColor: function (value) { return polished_1.darken(0.05, value); }, disableColor: function (value) { return polished_1.rgba(value, 0.5); }, OUTLINE: polished_1.transparentize(0.5, exports.defaultPalette.MAIN) }, exports.defaultPalette), userPalette, userPalette.OUTLINE == null && userPalette.MAIN != null
        ? { OUTLINE: polished_1.transparentize(0.5, userPalette.MAIN) }
        : null);
    return created;
};
//# sourceMappingURL=createPalette.js.map