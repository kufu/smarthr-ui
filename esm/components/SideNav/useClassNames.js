import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { SideNav } from './SideNav';
export function useClassNames() {
    const generate = useClassNameGenerator(SideNav.displayName || 'SideNav');
    return useMemo(() => ({
        wrapper: generate(),
        item: generate('item'),
        itemTitle: generate('itemTitle'),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map