"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMultiComboBoxClassNames = exports.useSingleComboBoxClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const _1 = require(".");
function useSingleComboBoxClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.SingleComboBox.displayName || 'SingleComboBox');
    return (0, react_1.useMemo)(() => ({
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
exports.useSingleComboBoxClassNames = useSingleComboBoxClassNames;
function useMultiComboBoxClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.MultiComboBox.displayName || 'MultiComboBox');
    return (0, react_1.useMemo)(() => ({
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
exports.useMultiComboBoxClassNames = useMultiComboBoxClassNames;
//# sourceMappingURL=useClassNames.js.map