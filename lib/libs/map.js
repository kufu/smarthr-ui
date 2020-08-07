"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatArrayToMap = exports.mapToKeyArray = exports.getIsInclude = void 0;
exports.getIsInclude = function (map, key) { return !!map.get(key); };
exports.mapToKeyArray = function (map) { return Array.from(map.keys()); };
exports.flatArrayToMap = function (array) {
    var map = new Map();
    array.forEach(function (item) { return map.set(item, item); });
    return map;
};
//# sourceMappingURL=map.js.map