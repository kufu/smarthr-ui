"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const Header_1 = require("./Header");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(Header_1.Header.displayName || 'Header');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        logo: generate('logo'),
        tenantInfo: generate('tenantInfo'),
        actions: generate('actions'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map