import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { MultiComboBox, SingleComboBox } from '.';
export function useSingleComboBoxClassNames() {
    const generate = useClassNameGenerator(SingleComboBox.displayName || 'SingleComboBox');
    return useMemo(() => ({
        wrapper: generate(),
        input: generate('input'),
        clearButton: generate('clearButton'),
        listBox: {
            dropdownList: generate('dropdownList'),
            addButton: generate('addButton'),
            selectButton: generate('selectButton'),
            noItems: generate('noItems'),
        },
    }), [generate]);
}
export function useMultiComboBoxClassNames() {
    const generate = useClassNameGenerator(MultiComboBox.displayName || 'MultiComboBox');
    return useMemo(() => ({
        wrapper: generate(),
        selectedList: generate('selectedList'),
        selectedItem: generate('selectedItem'),
        selectedItemLabel: generate('selectedItemLabel'),
        deleteButton: generate('deleteButton'),
        input: generate('input'),
        placeholder: generate('placeholder'),
        listBox: {
            dropdownList: generate('dropdownList'),
            addButton: generate('addButton'),
            selectButton: generate('selectButton'),
            noItems: generate('noItems'),
        },
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map