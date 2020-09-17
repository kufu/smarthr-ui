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
import { merge } from '../libs/lodash';
import { defaultPalette } from './createPalette';
var lineWidth = '1px';
var lineStyle = 'solid';
var lineColor = defaultPalette.BORDER;
export var defaultFrame = {
    border: {
        lineWidth: lineWidth,
        lineStyle: lineStyle,
        default: lineWidth + " " + lineStyle + " " + lineColor,
        radius: {
            s: '4px',
            m: '6px',
        },
    },
};
export var createFrame = function (userFrame, userPalette) {
    if (userFrame === void 0) { userFrame = {}; }
    if (userPalette === void 0) { userPalette = {}; }
    var color = userPalette.BORDER || defaultPalette.BORDER;
    var created = merge({
        border: __assign(__assign({}, defaultFrame.border), { default: lineWidth + " " + lineStyle + " " + color }),
    }, userFrame);
    return created;
};
//# sourceMappingURL=createFrame.js.map