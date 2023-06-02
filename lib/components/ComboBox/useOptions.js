"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOptions = void 0;
const react_1 = require("react");
const react_innertext_1 = __importDefault(require("react-innertext"));
const useId_1 = require("../../hooks/useId");
const comboBoxHelper_1 = require("./comboBoxHelper");
function useOptions({ items, selected, creatable, inputValue = '', isFilteringDisabled = false, }) {
    const isInputValueAddable = (0, react_1.useMemo)(() => creatable && inputValue !== '' && !items.some((item) => item.label === inputValue), [creatable, inputValue, items]);
    const newItemId = (0, useId_1.useId)();
    const optionIdPrefix = (0, useId_1.useId)();
    const getOptionId = (0, react_1.useCallback)((optionIndex) => {
        return `${optionIdPrefix}-${optionIndex}`;
    }, [optionIdPrefix]);
    const isSelected = (0, react_1.useCallback)((item) => {
        if (Array.isArray(selected)) {
            return (selected.find((_selected) => _selected.label === item.label && _selected.value === item.value) !== undefined);
        }
        else {
            return selected !== null && selected.label === item.label;
        }
    }, [selected]);
    const allOptions = (0, react_1.useMemo)(() => {
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
    const options = (0, react_1.useMemo)(() => {
        if (isFilteringDisabled) {
            return allOptions;
        }
        return allOptions.filter(({ item: { label } }) => {
            if (!inputValue)
                return true;
            return (0, comboBoxHelper_1.convertMatchableString)((0, react_innertext_1.default)(label)).includes((0, comboBoxHelper_1.convertMatchableString)(inputValue));
        });
    }, [allOptions, inputValue, isFilteringDisabled]);
    return {
        options,
    };
}
exports.useOptions = useOptions;
//# sourceMappingURL=useOptions.js.map