"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)('AppNavi');
    // AppNaviDropdown は Dropdown コンポーネントを使っているため、className はそちらで付与される
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        label: generate('label'),
        buttons: generate('buttons'),
        listItem: generate('listItem'),
        anchor: generate('anchor'),
        customTag: generate('customTag'),
        button: generate('button'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map