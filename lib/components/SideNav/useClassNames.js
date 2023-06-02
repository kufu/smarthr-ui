"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const SideNav_1 = require("./SideNav");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(SideNav_1.SideNav.displayName || 'SideNav');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        item: generate('item'),
        itemTitle: generate('itemTitle'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map