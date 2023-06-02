"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const StatusLabel_1 = require("./StatusLabel");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(StatusLabel_1.StatusLabel.displayName || 'StatusLabel');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map