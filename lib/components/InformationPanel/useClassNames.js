"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const InformationPanel_1 = require("./InformationPanel");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(InformationPanel_1.InformationPanel.displayName || 'InformationPanel');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        title: generate('title'),
        closeButton: generate('closeButton'),
        content: generate('content'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map