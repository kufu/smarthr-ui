"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNameGenerator = void 0;
const react_1 = require("react");
const PREFIX = 'smarthr-ui';
function useClassNameGenerator(componentName) {
    return (0, react_1.useCallback)((partName) => {
        if (!partName) {
            return `${PREFIX}-${componentName}`;
        }
        return `${PREFIX}-${componentName}-${partName}`;
    }, [componentName]);
}
exports.useClassNameGenerator = useClassNameGenerator;
//# sourceMappingURL=useClassNameGenerator.js.map