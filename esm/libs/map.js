export const getIsInclude = (map, key) => !!map.get(key);
export const mapToKeyArray = (map) => Array.from(map.keys());
export const flatArrayToMap = (array) => {
    const map = new Map();
    array.forEach((item) => map.set(item, item));
    return map;
};
//# sourceMappingURL=map.js.map