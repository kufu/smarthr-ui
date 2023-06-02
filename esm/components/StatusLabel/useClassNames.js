import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { StatusLabel } from './StatusLabel';
export function useClassNames() {
    const generate = useClassNameGenerator(StatusLabel.displayName || 'StatusLabel');
    return useMemo(() => ({
        wrapper: generate(),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map