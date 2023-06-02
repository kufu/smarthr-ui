"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const AccordionPanel_1 = require("./AccordionPanel");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(AccordionPanel_1.AccordionPanel.displayName || 'AccordionPanel');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        item: generate('item'),
        trigger: generate('trigger'),
        content: generate('content'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map