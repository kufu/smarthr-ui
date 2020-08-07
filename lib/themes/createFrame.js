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
exports.createFrame = exports.defaultFrame = void 0;
var lodash_1 = require("../libs/lodash");
var createPalette_1 = require("./createPalette");
var lineWidth = '1px';
var lineStyle = 'solid';
var lineColor = createPalette_1.defaultPalette.BORDER;
exports.defaultFrame = {
    border: {
        lineWidth: lineWidth,
        lineStyle: lineStyle,
        default: lineWidth + " " + lineStyle + " " + lineColor,
        radius: {
            s: '3px',
            m: '6px',
            l: '8px',
        },
    },
};
exports.createFrame = function (userFrame, userPalette) {
    if (userFrame === void 0) { userFrame = {}; }
    if (userPalette === void 0) { userPalette = {}; }
    var color = userPalette.BORDER || createPalette_1.defaultPalette.BORDER;
    var created = lodash_1.merge({
        border: __assign(__assign({}, exports.defaultFrame.border), { default: lineWidth + " " + lineStyle + " " + color }),
    }, userFrame);
    return created;
};
//# sourceMappingURL=createFrame.js.map