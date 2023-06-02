"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFrame = exports.defaultFrame = void 0;
const lodash_1 = require("../libs/lodash");
const createPalette_1 = require("./createPalette");
const lineWidth = '1px';
const lineStyle = 'solid';
const lineColor = createPalette_1.defaultPalette.BORDER;
/**
 * @deprecated The defaultFrame will be deprecated, please use defaultBorder or defaultRadius instead
 */
exports.defaultFrame = {
    border: {
        lineWidth,
        lineStyle,
        default: `${lineWidth} ${lineStyle} ${lineColor}`,
        radius: {
            s: '4px',
            m: '6px',
        },
    },
};
const createFrame = (userFrame = {}, userPalette = {}) => {
    const color = userPalette.BORDER || createPalette_1.defaultPalette.BORDER;
    const created = (0, lodash_1.merge)({
        border: {
            ...exports.defaultFrame.border,
            default: `${lineWidth} ${lineStyle} ${color}`,
            radius: { ...exports.defaultFrame.border.radius },
        },
    }, userFrame);
    return created;
};
exports.createFrame = createFrame;
//# sourceMappingURL=createFrame.js.map