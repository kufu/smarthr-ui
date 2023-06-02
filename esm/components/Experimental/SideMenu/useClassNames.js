import { useMemo } from 'react';
import { useClassNameGenerator } from '../../../hooks/useClassNameGenerator';
import { SideMenu } from './SideMenu';
export function useClassNames() {
    const generate = useClassNameGenerator(SideMenu.displayName || 'SideMenu');
    return useMemo(() => ({
        wrapper: generate(),
        group: generate('group'),
        item: generate('item'),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map