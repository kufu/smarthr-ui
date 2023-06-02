"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../../hooks/useClassNameGenerator");
const DropdownMenuButton_1 = require("./DropdownMenuButton");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(DropdownMenuButton_1.DropdownMenuButton.displayName || 'DropdownMenuButton');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        trigger: generate('trigger'),
        panel: generate('panel'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map