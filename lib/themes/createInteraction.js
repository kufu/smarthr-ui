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
exports.createInteraction = exports.defaultInteraction = void 0;
var lodash_1 = require("../libs/lodash");
var hoverAnimationDuration = '.3s';
var hoverAnimationTiming = 'ease-out';
exports.defaultInteraction = {
    hover: {
        feedbackOpacity: '.7',
        animationDuration: hoverAnimationDuration,
        animationTiming: hoverAnimationTiming,
        animation: hoverAnimationDuration + " " + hoverAnimationTiming,
    },
};
exports.createInteraction = function (userInteraction) {
    if (userInteraction === void 0) { userInteraction = {}; }
    var created = lodash_1.merge(__assign({}, exports.defaultInteraction), userInteraction);
    return created;
};
//# sourceMappingURL=createInteraction.js.map