"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBreakpoint = exports.defaultBreakpoint = void 0;
const lodash_1 = require("../libs/lodash");
exports.defaultBreakpoint = { SP: 599, TABLET: 959 };
const createBreakpoint = (userBreakpoint = {}) => {
    const created = (0, lodash_1.merge)({ ...exports.defaultBreakpoint }, userBreakpoint);
    return created;
};
exports.createBreakpoint = createBreakpoint;
//# sourceMappingURL=createBreakpoint.js.map