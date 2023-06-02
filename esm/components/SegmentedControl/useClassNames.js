import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { SegmentedControl } from './SegmentedControl';
export function useClassNames() {
    const generate = useClassNameGenerator(SegmentedControl.displayName || 'SegmentedControl');
    return useMemo(() => ({
        wrapper: generate(),
        button: generate('button'),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map