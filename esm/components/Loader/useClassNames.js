import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { Loader } from './Loader';
export function useClassNames() {
    const generate = useClassNameGenerator(Loader.displayName || 'Loader');
    return useMemo(() => ({
        wrapper: generate(),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map