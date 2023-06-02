"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../../hooks/useClassNameGenerator");
const AppLauncher_1 = require("./AppLauncher");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(AppLauncher_1.AppLauncher.displayName || 'Header');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        footer: generate('footer'),
        category: generate('category'),
        link: generate('link'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map