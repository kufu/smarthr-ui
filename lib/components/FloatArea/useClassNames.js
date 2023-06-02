"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const FloatArea_1 = require("./FloatArea");
const useClassNames = () => {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(FloatArea_1.FloatArea.displayName || 'FloatArea');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        errorText: generate('errorText'),
    }), [generate]);
};
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map