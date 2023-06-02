"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const Textarea_1 = require("./Textarea");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(Textarea_1.Textarea.displayName || 'Textarea');
    return (0, react_1.useMemo)(() => ({
        textarea: generate('textarea'),
        counter: generate('counter'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map