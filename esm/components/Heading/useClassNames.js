import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { Heading } from './Heading';
export function useClassNames() {
    const generate = useClassNameGenerator(Heading.displayName || 'Heading');
    return useMemo(() => ({
        wrapper: generate(),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map