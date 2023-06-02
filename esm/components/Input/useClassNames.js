import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { Input } from './Input';
export function useClassNames() {
    const generate = useClassNameGenerator(Input.displayName || 'Input');
    return useMemo(() => ({
        wrapper: generate(),
        input: generate('input'),
        prefix: generate('prefix'),
        suffix: generate('suffix'),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map