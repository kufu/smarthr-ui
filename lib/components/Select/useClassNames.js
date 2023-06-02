"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const Select_1 = require("./Select");
const useClassNames = () => {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(Select_1.Select.displayName || 'Select');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
    }), [generate]);
};
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map