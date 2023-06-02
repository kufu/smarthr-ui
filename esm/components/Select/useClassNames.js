import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { Select } from './Select';
export const useClassNames = () => {
    const generate = useClassNameGenerator(Select.displayName || 'Select');
    return useMemo(() => ({
        wrapper: generate(),
    }), [generate]);
};
//# sourceMappingURL=useClassNames.js.map