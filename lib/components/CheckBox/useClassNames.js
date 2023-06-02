"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const CheckBox_1 = require("./CheckBox");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(CheckBox_1.CheckBox.displayName || 'CheckBox');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        checkBox: generate('checkBox'),
        label: generate('label'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map