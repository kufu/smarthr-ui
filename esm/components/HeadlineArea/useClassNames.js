import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { HeadlineArea } from './HeadlineArea';
export function useClassNames() {
    const generate = useClassNameGenerator(HeadlineArea.displayName || 'HeadlineArea');
    return useMemo(() => ({
        wrapper: generate(),
        description: generate('description'),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map