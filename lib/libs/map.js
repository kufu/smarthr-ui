"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatArrayToMap = exports.mapToKeyArray = exports.getIsInclude = void 0;
const getIsInclude = (map, key) => !!map.get(key);
exports.getIsInclude = getIsInclude;
const mapToKeyArray = (map) => Array.from(map.keys());
exports.mapToKeyArray = mapToKeyArray;
const flatArrayToMap = (array) => {
    const map = new Map();
    array.forEach((item) => map.set(item, item));
    return map;
};
exports.flatArrayToMap = flatArrayToMap;
//# sourceMappingURL=map.js.map