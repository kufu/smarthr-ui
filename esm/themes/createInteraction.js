import { merge } from '../libs/lodash';
const hoverAnimationDuration = '.3s';
const hoverAnimationTiming = 'ease-out';
export const defaultInteraction = {
    hover: {
        feedbackOpacity: '.7',
        animationDuration: hoverAnimationDuration,
        animationTiming: hoverAnimationTiming,
        animation: `${hoverAnimationDuration} ${hoverAnimationTiming}`,
    },
};
export const createInteraction = (userInteraction = {}) => {
    const created = merge({
        ...defaultInteraction,
    }, userInteraction);
    return created;
};
//# sourceMappingURL=createInteraction.js.map