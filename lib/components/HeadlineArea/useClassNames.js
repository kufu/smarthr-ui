"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const HeadlineArea_1 = require("./HeadlineArea");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(HeadlineArea_1.HeadlineArea.displayName || 'HeadlineArea');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        description: generate('description'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map