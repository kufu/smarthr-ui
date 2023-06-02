"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const FieldSet_1 = require("./FieldSet");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(FieldSet_1.FieldSet.displayName || 'FieldSet');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        title: generate('title'),
        titleText: generate('titleText'),
        label: generate('label'),
        input: generate('input'),
        error: generate('error'),
        errorIcon: generate('errorIcon'),
        errorText: generate('errorText'),
        help: generate('help'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map