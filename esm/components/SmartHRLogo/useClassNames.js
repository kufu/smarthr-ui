import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { SmartHRLogo } from './SmartHRLogo';
export function useClassNames() {
    const generate = useClassNameGenerator(SmartHRLogo.displayName || 'SmartHRLogo');
    return useMemo(() => ({
        wrapper: generate(),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map