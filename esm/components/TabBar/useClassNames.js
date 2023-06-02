import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { TabBar, TabItem } from '.';
export function useClassNames() {
    const generate = useClassNameGenerator(TabBar.displayName || 'TabBar');
    const generateForItem = useClassNameGenerator(TabItem.displayName || 'TabItem');
    return useMemo(() => ({
        tabBar: {
            wrapper: generate(),
        },
        tabItem: {
            wrapper: generateForItem(),
        },
    }), [generate, generateForItem]);
}
//# sourceMappingURL=useClassNames.js.map