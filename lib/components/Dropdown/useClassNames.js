"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const Dropdown_1 = require("./Dropdown");
const useClassNames = () => {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(Dropdown_1.Dropdown.displayName || 'Dropdown');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        closer: generate('closer'),
        content: generate('content'),
        scrollArea: generate('scrollArea'),
    }), [generate]);
};
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map