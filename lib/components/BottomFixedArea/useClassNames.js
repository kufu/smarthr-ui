"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)('BottomFixedArea');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        description: generate('description'),
        buttonList: generate('buttonList'),
        primaryButton: generate('primaryButton'),
        secondaryButton: generate('secondaryButton'),
        tertiaryList: generate('tertiaryList'),
        tertiaryListItem: generate('tertiaryListItem'),
        tertiaryLink: generate('tertiaryLink'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map