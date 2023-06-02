"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const DropZone_1 = require("./DropZone");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(DropZone_1.DropZone.displayName || 'DropZone');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map