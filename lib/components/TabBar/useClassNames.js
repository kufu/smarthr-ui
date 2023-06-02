"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const _1 = require(".");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.TabBar.displayName || 'TabBar');
    const generateForItem = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.TabItem.displayName || 'TabItem');
    return (0, react_1.useMemo)(() => ({
        tabBar: {
            wrapper: generate(),
        },
        tabItem: {
            wrapper: generateForItem(),
        },
    }), [generate, generateForItem]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map