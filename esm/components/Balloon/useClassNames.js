import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
export function useClassNames() {
    const generate = useClassNameGenerator('Balloon');
    return useMemo(() => ({
        wrapper: generate(),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map