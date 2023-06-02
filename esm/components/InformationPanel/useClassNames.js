import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { InformationPanel } from './InformationPanel';
export function useClassNames() {
    const generate = useClassNameGenerator(InformationPanel.displayName || 'InformationPanel');
    return useMemo(() => ({
        wrapper: generate(),
        title: generate('title'),
        closeButton: generate('closeButton'),
        content: generate('content'),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map