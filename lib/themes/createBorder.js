"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBorder = exports.defaultBorder = void 0;
const lodash_1 = require("../libs/lodash");
const createColor_1 = require("./createColor");
const defaultLineWidth = '1px';
const defaultLineStyle = 'solid';
const defaultLineColor = createColor_1.defaultColor.BORDER;
const highContrastBorderColor = createColor_1.defaultColor.GREY_100;
exports.defaultBorder = {
    lineWidth: defaultLineWidth,
    lineStyle: defaultLineStyle,
    shorthand: `${defaultLineWidth} ${defaultLineStyle} ${defaultLineColor}`,
    highContrast: `${defaultLineWidth} ${defaultLineStyle} ${highContrastBorderColor}`,
};
const createBorder = (userBorder = {}, userColor = {}) => {
    const color = userColor.BORDER || createColor_1.defaultColor.BORDER;
    const created = (0, lodash_1.merge)({
        ...exports.defaultBorder,
        shorthand: `${defaultLineWidth} ${defaultLineStyle} ${color}`,
    }, userBorder);
    return created;
};
exports.createBorder = createBorder;
//# sourceMappingURL=createBorder.js.map