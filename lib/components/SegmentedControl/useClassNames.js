"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const SegmentedControl_1 = require("./SegmentedControl");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(SegmentedControl_1.SegmentedControl.displayName || 'SegmentedControl');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        button: generate('button'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map