import { useCallback, useMemo } from 'react';
import innerText from 'react-innertext';
import { useId } from '../../hooks/useId';
import { convertMatchableString } from './comboBoxHelper';
export function useOptions({ items, selected, creatable, inputValue = '', isFilteringDisabled = false, }) {
    const isInputValueAddable = useMemo(() => creatable && inputValue !== '' && !items.some((item) => item.label === inputValue), [creatable, inputValue, items]);
    const newItemId = useId();
    const optionIdPrefix = useId();
    const getOptionId = useCallback((optionIndex) => {
        return `${optionIdPrefix}-${optionIndex}`;
    }, [optionIdPrefix]);
    const isSelected = useCallback((item) => {
        if (Array.isArray(selected)) {
            return (selected.find((_selected) => _selected.label === item.label && _selected.value === item.value) !== undefined);
        }
        else {
            return selected !== null && selected.label === item.label;
        }
    }, [selected]);
    const allOptions = useMemo(() => {
        const _options = items.map((item, i) => ({
            id: getOptionId(i),
            selected: isSelected(item),
            isNew: false,
            item,
        }));
        if (isInputValueAddable) {
            const addingOption = {
                id: newItemId,
                isNew: true,
                selected: false,
                item: { label: inputValue, value: inputValue },
            };
            return [addingOption, ..._options];
        }
        return _options;
    }, [getOptionId, inputValue, isInputValueAddable, isSelected, items, newItemId]);
    const options = useMemo(() => {
        if (isFilteringDisabled) {
            return allOptions;
        }
        return allOptions.filter(({ item: { label } }) => {
            if (!inputValue)
                return true;
            return convertMatchableString(innerText(label)).includes(convertMatchableString(inputValue));
        });
    }, [allOptions, inputValue, isFilteringDisabled]);
    return {
        options,
    };
}
//# sourceMappingURL=useOptions.js.map