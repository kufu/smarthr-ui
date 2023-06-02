import { merge } from '../libs/lodash';
export const defaultBreakpoint = { SP: 599, TABLET: 959 };
export const createBreakpoint = (userBreakpoint = {}) => {
    const created = merge({ ...defaultBreakpoint }, userBreakpoint);
    return created;
};
//# sourceMappingURL=createBreakpoint.js.map