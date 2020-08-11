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
var hoverAnimationDuration = '.3s';
var hoverAnimationTiming = 'ease-out';
export var defaultInteraction = {
    hover: {
        feedbackOpacity: '.7',
        animationDuration: hoverAnimationDuration,
        animationTiming: hoverAnimationTiming,
        animation: hoverAnimationDuration + " " + hoverAnimationTiming,
    },
};
export var createInteraction = function (userInteraction) {
    if (userInteraction === void 0) { userInteraction = {}; }
    var created = merge(__assign({}, defaultInteraction), userInteraction);
    return created;
};
//# sourceMappingURL=createInteraction.js.map