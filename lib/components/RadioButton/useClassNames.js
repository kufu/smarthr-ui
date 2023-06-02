"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const RadioButton_1 = require("./RadioButton");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(RadioButton_1.RadioButton.displayName || 'RadioButton');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        radioButton: generate('radioButton'),
        label: generate('label'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map