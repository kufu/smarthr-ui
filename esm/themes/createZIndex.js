import { merge } from '../libs/lodash';
export const defaultZIndex = {
    AUTO: 'auto',
    DEFAULT: 0,
    FIXED_MENU: 100,
    OVERLAP_BASE: 10000,
    OVERLAP: 10500,
    FLASH_MESSAGE: 11000,
};
export const createZIndex = (userZIndex = {}) => {
    const created = merge({
        ...defaultZIndex,
    }, userZIndex);
    return created;
};
//# sourceMappingURL=createZIndex.js.map