import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { RightFixedNote } from './RightFixedNote';
export function useClassNames() {
    const generate = useClassNameGenerator(RightFixedNote.displayName || 'RightFixedNote');
    return useMemo(() => ({
        wrapper: generate(),
        title: generate('title'),
        item: generate('item'),
        itemEditButton: generate('itemEditButton'),
        itemText: generate('itemText'),
        itemDate: generate('itemDate'),
        itemAuthor: generate('itemAuthor'),
        textarea: generate('textarea'),
        submitButton: generate('submitButton'),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map