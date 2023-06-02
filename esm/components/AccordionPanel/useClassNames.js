import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { AccordionPanel } from './AccordionPanel';
export function useClassNames() {
    const generate = useClassNameGenerator(AccordionPanel.displayName || 'AccordionPanel');
    return useMemo(() => ({
        wrapper: generate(),
        item: generate('item'),
        trigger: generate('trigger'),
        content: generate('content'),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map