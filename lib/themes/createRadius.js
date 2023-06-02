"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRadius = exports.defaultRadius = void 0;
const lodash_1 = require("../libs/lodash");
exports.defaultRadius = {
    s: '4px',
    m: '6px',
    l: '8px',
    full: '10000px',
};
const createRadius = (userRadius = {}) => {
    const created = (0, lodash_1.merge)({ ...exports.defaultRadius }, userRadius);
    return created;
};
exports.createRadius = createRadius;
//# sourceMappingURL=createRadius.js.map