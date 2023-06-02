import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { Header } from './Header';
export function useClassNames() {
    const generate = useClassNameGenerator(Header.displayName || 'Header');
    return useMemo(() => ({
        wrapper: generate(),
        logo: generate('logo'),
        tenantInfo: generate('tenantInfo'),
        actions: generate('actions'),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map