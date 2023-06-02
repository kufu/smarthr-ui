import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { FormGroup } from '.';
export function useClassNames() {
    const generate = useClassNameGenerator(FormGroup.displayName || 'FormGroup');
    return useMemo(() => ({
        wrapper: generate(),
        label: generate('label'),
        helpMessage: generate('helpMessage'),
        exampleMessage: generate('exampleMessage'),
        errorMessage: generate('errorMessage'),
        supplementaryMessage: generate('supplementaryMessage'),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map