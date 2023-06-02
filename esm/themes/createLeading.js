import { merge } from '../libs/lodash';
export const defaultLeading = {
    NONE: 1,
    TIGHT: 1.25,
    NORMAL: 1.5,
    RELAXED: 1.75,
};
export const createLeading = (userLeading = {}) => {
    const { ...userTokens } = userLeading;
    const created = merge(defaultLeading, userTokens);
    return created;
};
//# sourceMappingURL=createLeading.js.map