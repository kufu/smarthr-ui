"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInteraction = exports.defaultInteraction = void 0;
const lodash_1 = require("../libs/lodash");
const hoverAnimationDuration = '.3s';
const hoverAnimationTiming = 'ease-out';
exports.defaultInteraction = {
    hover: {
        feedbackOpacity: '.7',
        animationDuration: hoverAnimationDuration,
        animationTiming: hoverAnimationTiming,
        animation: `${hoverAnimationDuration} ${hoverAnimationTiming}`,
    },
};
const createInteraction = (userInteraction = {}) => {
    const created = (0, lodash_1.merge)({
        ...exports.defaultInteraction,
    }, userInteraction);
    return created;
};
exports.createInteraction = createInteraction;
//# sourceMappingURL=createInteraction.js.map