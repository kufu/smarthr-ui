import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { FloatArea } from './FloatArea';
export const useClassNames = () => {
    const generate = useClassNameGenerator(FloatArea.displayName || 'FloatArea');
    return useMemo(() => ({
        wrapper: generate(),
        errorText: generate('errorText'),
    }), [generate]);
};
//# sourceMappingURL=useClassNames.js.map