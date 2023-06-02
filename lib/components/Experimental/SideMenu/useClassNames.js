"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../../hooks/useClassNameGenerator");
const SideMenu_1 = require("./SideMenu");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(SideMenu_1.SideMenu.displayName || 'SideMenu');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        group: generate('group'),
        item: generate('item'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map