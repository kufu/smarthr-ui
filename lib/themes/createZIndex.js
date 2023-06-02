"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createZIndex = exports.defaultZIndex = void 0;
const lodash_1 = require("../libs/lodash");
exports.defaultZIndex = {
    AUTO: 'auto',
    DEFAULT: 0,
    FIXED_MENU: 100,
    OVERLAP_BASE: 10000,
    OVERLAP: 10500,
    FLASH_MESSAGE: 11000,
};
const createZIndex = (userZIndex = {}) => {
    const created = (0, lodash_1.merge)({
        ...exports.defaultZIndex,
    }, userZIndex);
    return created;
};
exports.createZIndex = createZIndex;
//# sourceMappingURL=createZIndex.js.map