import { merge } from '../libs/lodash';
export const defaultRadius = {
    s: '4px',
    m: '6px',
    l: '8px',
    full: '10000px',
};
export const createRadius = (userRadius = {}) => {
    const created = merge({ ...defaultRadius }, userRadius);
    return created;
};
//# sourceMappingURL=createRadius.js.map