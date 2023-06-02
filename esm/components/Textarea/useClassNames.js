import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { Textarea } from './Textarea';
export function useClassNames() {
    const generate = useClassNameGenerator(Textarea.displayName || 'Textarea');
    return useMemo(() => ({
        textarea: generate('textarea'),
        counter: generate('counter'),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map