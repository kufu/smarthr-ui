import { useMemo } from 'react';
import { useClassNameGenerator } from '../../../hooks/useClassNameGenerator';
import { DropdownMenuButton } from './DropdownMenuButton';
export function useClassNames() {
    const generate = useClassNameGenerator(DropdownMenuButton.displayName || 'DropdownMenuButton');
    return useMemo(() => ({
        wrapper: generate(),
        trigger: generate('trigger'),
        panel: generate('panel'),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map