"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const _1 = require(".");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.FormGroup.displayName || 'FormGroup');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        label: generate('label'),
        helpMessage: generate('helpMessage'),
        exampleMessage: generate('exampleMessage'),
        errorMessage: generate('errorMessage'),
        supplementaryMessage: generate('supplementaryMessage'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map