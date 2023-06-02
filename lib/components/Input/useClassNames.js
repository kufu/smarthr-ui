"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const Input_1 = require("./Input");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(Input_1.Input.displayName || 'Input');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        input: generate('input'),
        prefix: generate('prefix'),
        suffix: generate('suffix'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map