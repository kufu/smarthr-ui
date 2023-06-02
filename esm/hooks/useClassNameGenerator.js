import { useCallback } from 'react';
const PREFIX = 'smarthr-ui';
export function useClassNameGenerator(componentName) {
    return useCallback((partName) => {
        if (!partName) {
            return `${PREFIX}-${componentName}`;
        }
        return `${PREFIX}-${componentName}-${partName}`;
    }, [componentName]);
}
//# sourceMappingURL=useClassNameGenerator.js.map