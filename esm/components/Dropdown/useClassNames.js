import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { Dropdown } from './Dropdown';
export const useClassNames = () => {
    const generate = useClassNameGenerator(Dropdown.displayName || 'Dropdown');
    return useMemo(() => ({
        wrapper: generate(),
        closer: generate('closer'),
        content: generate('content'),
        scrollArea: generate('scrollArea'),
    }), [generate]);
};
//# sourceMappingURL=useClassNames.js.map