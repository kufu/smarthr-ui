import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { Pagination } from './Pagination';
export function useClassNames() {
    const generate = useClassNameGenerator(Pagination.displayName || 'Pagination');
    return useMemo(() => ({
        wrapper: generate(),
        page: generate('page'),
        current: generate('current'),
        first: generate('first'),
        prev: generate('prev'),
        next: generate('next'),
        last: generate('last'),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map