"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLeading = exports.defaultLeading = void 0;
const lodash_1 = require("../libs/lodash");
exports.defaultLeading = {
    NONE: 1,
    TIGHT: 1.25,
    NORMAL: 1.5,
    RELAXED: 1.75,
};
const createLeading = (userLeading = {}) => {
    const { ...userTokens } = userLeading;
    const created = (0, lodash_1.merge)(exports.defaultLeading, userTokens);
    return created;
};
exports.createLeading = createLeading;
//# sourceMappingURL=createLeading.js.map