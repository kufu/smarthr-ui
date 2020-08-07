export var getIsInclude = function (map, key) { return !!map.get(key); };
export var mapToKeyArray = function (map) { return Array.from(map.keys()); };
export var flatArrayToMap = function (array) {
    var map = new Map();
    array.forEach(function (item) { return map.set(item, item); });
    return map;
};
//# sourceMappingURL=map.js.map