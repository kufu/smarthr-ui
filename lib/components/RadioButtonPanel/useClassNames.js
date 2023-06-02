"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const RadioButtonPanel_1 = require("./RadioButtonPanel");
const useClassNames = (className = '') => {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(RadioButtonPanel_1.RadioButtonPanel.displayName || 'RadioButtonPanel');
    return (0, react_1.useMemo)(() => ({
        wrapper: `${className} ${generate()}`,
    }), [className, generate]);
};
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map